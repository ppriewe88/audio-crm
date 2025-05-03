from fastapi import FastAPI, Form, Request
import uvicorn
import json
import localrag_patrick as localrag
from system_helpers import find_sql_query, CYAN, YELLOW, NEON_GREEN, RESET_COLOR
import database_access.data_retrieval as data_retrieval
import database_access.custom_queries as queries
import requests
from fastapi.middleware.cors import CORSMiddleware # middleware. requirement for frontend-suitable endpoint

' ############################### setting up app for API #################"'
app = FastAPI()

" ################# middleware block for frontend-suitable endpoint ###############"
# CORS-Middleware. Required for communication with frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # allow requests from frontend
    allow_credentials=True,
    allow_methods=["*"],  # allow all HTTP-methods
    allow_headers=["*"],  # allow all headers
)


' ################ initialization block for vault, embeddings, global variables #################'
@app.on_event("startup")
async def startup_event():
    
    # prepare ollama model for local testing
    global args, model, client
    args = localrag.parse_cli_input()
    model = args.model
    client = localrag.configure_ollama_client()
    
    # prepare system message and vault content
    llm_active = False
    if llm_active:
        global system_message, vault_content, vault_embeddings, vault_embeddings_tensor, connection
        system_message =  find_sql_query
        vault_content = localrag.load_vault_content()
        vault_embeddings = localrag.generate_embeddings_for_vault_content(vault_content)
        vault_embeddings_tensor = localrag.generate_vault_embeddings_tensor(vault_embeddings)

' ######################## endpoint to make requests for LLM and database #################'
@app.post("/get_context_and_send_request")
async def get_context_and_send_request(question: str = Form(...)):
    """
    - Get relevant context from the vault based on the user's question.

    - Then send user's question and the relevant context to the LLM (either local or cloud-based or official API of OpenAI).
    By system message, the LLM is instructed to answer in a specific way (i.e.: generate SQL clauses for given database context!).

    - Send the SQL clause to the database and get the result

    - Return: LLM-response (SQL-clause) AND retrieved data.

    """
    ' ################################## Getting relevant context ###################'
    # Get relevant context from vault
    relevant_context_and_tables = localrag.get_relevant_context(question, vault_embeddings_tensor, vault_content, top_k=5)
    relevant_context = relevant_context_and_tables["relevant_context"]  # Extract the relevant context
    relevant_tables = relevant_context_and_tables["relevant_tables"]  # Extract the relevant table names
    if relevant_context:
        # Convert list to a single string with newlines between items
        context_str = "\n".join(relevant_context)
    else:
        print("No relevant context found.")
    # Prepare the user's input by concatenating it with retrieved relevant context
    user_input_with_context = question
    if relevant_context:
        user_input_with_context = context_str + "\n\n" + question

    ' ############### sending request to cloud-model / local model / openAI-API #####'
    # send request to Cloud-LLM (e.g. Azure OpenAI)
    
    usage = "openAI" # "cloud" # "openAI"
    llm_call_successfull = True
    if usage == "cloud":
        # TODO: implement cloud model request
        print("sending request to cloud")
        # api_url_cloud = "https://your-cloud-llm-endpoint.openai.azure.com/openai/deployments/deployment-name/chat/completions?api-version=2024-02-15-preview"
        # llm_response = requests.post(
        #     api_url_cloud,
        #     headers={
        #         "Content-Type": "application/json",
        #         "api-key": "your-azure-key"
        #     },
        #     json={
        #         "messages": [
        #             {"role": "system", "content": system_message},
        #             {"role": "user", "content": user_input_with_context}
        #         ],
        #         "temperature": 0.2,
        #         "max_tokens": 1000,
        #         "top_p": 1,
        #         "frequency_penalty": 0,
        #         "presence_penalty": 0
        #     }
        # )
    elif usage == "local":
        print("running local test")
        api_url_local = "http://localhost:5000/chat"
        # send request to local LLM under different port (for testing and comparison of runtime)
        llm_response = requests.post(
            api_url_local,
            json={"messages": [
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_input_with_context}
                ]}
        )
        llm_response = llm_response.json()
        print(CYAN + llm_response + RESET_COLOR)
    elif usage == "openAI":
        print("\nsending request to OpenAI API")
        api_url_openai = "https://api.openai.com/v1/chat/completions"
        # sending request to official API of OpenAI
        # configuring message first
        openai_api_key = "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"  # CAREFUL: DEACTIVATE if not needed or stolen!

        headers = {
            "Authorization": f"Bearer {openai_api_key}",
            "Content-Type": "application/json"
        }

        data = {
            "model": "gpt-3.5-turbo",  # oder "gpt-3.5-turbo" je nach Bedarf
            "messages": [
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_input_with_context}
            ],
            "temperature": 0.1,
            "max_tokens": 250
        }
        # now sending request
        llm_response = requests.post(api_url_openai, headers=headers, json=data)
        # erorr handling
        if llm_response.status_code != 200:
            raise Exception(f"OpenAI API Error: {llm_response.status_code} - {llm_response.text}")

        llm_response = llm_response.json()['choices'][0]['message']['content']
        print("Received query build by LLM:", CYAN + llm_response + RESET_COLOR)
    else:
        llm_response=("Invalid usage option. Choose 'cloud', 'local', or 'openAI'.")
        llm_call_successfull = False

    ' ############### Send SQL clause to database and get result ###############'
    if llm_call_successfull:
        # Send the SQL clause to the database and get the result
        print("\nconnecting to database")
        connection = data_retrieval.establish_database_connection()
        # extract sql query and send to database
        response_query = llm_response
        print("send query to database...")
        query_results = data_retrieval.make_query(response_query, connection)
        print("Received query results:", YELLOW + str(query_results) + RESET_COLOR)
        connection.close()
        print("Connection to database closed!\n")
    else:
        query_results = "No results retrieved"

    return {"user question": question, "RAG-retrieval (relevant tables)": relevant_tables, "llm_response": response_query, "query_results": query_results}

' ###################### endpoint to get storage locations/inventories #################'
@app.post("/get_storage_info")
async def get_storage_info(articlenumber: str = Form(...)):
    # create query for getting storage locations and inventories
    query = queries.get_storage_info.replace("[PLACEHOLDER]", articlenumber)
    # Send the SQL clause to the database and get the result
    print("\nconnecting to database")
    connection = data_retrieval.establish_database_connection()
    print("send query to database...")
    query_results = data_retrieval.make_query(query, connection)
    print("Received query results:", YELLOW + str(query_results) + RESET_COLOR)
    connection.close()
    print("Connection to database closed!\n")
    
    return {"articlenumber": articlenumber, "query_results": query_results}

' ###################### endpoint to insert orders #################'
@app.post("/insert_order")
async def get_data(request: Request):
    form = await request.form()
    wizard_inputs_json = form.get("wizard_inputs")  # ein String wie '["1", "5", "5"]'
    inputs_list = json.loads(wizard_inputs_json)  # Jetzt eine Python-Liste: ['1', '5', '5']
    print(inputs_list)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)