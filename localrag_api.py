from fastapi import FastAPI, Form
import uvicorn
import localrag_patrick as localrag
from system_helpers import find_sql_query, CYAN, YELLOW, NEON_GREEN, RESET_COLOR
from database_access.data_retrieval import establish_database_connection, make_query

app = FastAPI()

embedding = None
texts = None


@app.on_event("startup")
async def startup_event():
    global args, model, client, system_message, vault_content, vault_embeddings, vault_embeddings_tensor, connection
    # prepare system
    args = localrag.parse_cli_input()
    model = args.model
    client = localrag.configure_ollama_client()
    system_message =  find_sql_query
    vault_content = localrag.load_vault_content()
    vault_embeddings = localrag.generate_embeddings_for_vault_content(vault_content)
    vault_embeddings_tensor = localrag.generate_vault_embeddings_tensor(vault_embeddings)
    connection = localrag.establish_database_connection()

@app.post("/ask")
async def ask(question: str = Form(...)):

    # get response from LLM
    response = localrag.ollama_chat_no_memory(
                        client = client,
                        user_input = question, 
                        system_message=system_message, 
                        vault_embeddings_tensor=vault_embeddings_tensor, 
                        vault_content=vault_content, 
                        ollama_model = args.model)
    

    return response




if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)