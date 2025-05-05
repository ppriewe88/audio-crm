from fastapi import FastAPI, Request
import uvicorn
import localrag_patrick as localrag
from system_helpers import NEON_GREEN, RESET_COLOR

mock_llm = FastAPI()

@mock_llm.on_event("startup")
async def startup_event():
    global args, model, client
    # prepare ollama model for local testing
    args = localrag.parse_cli_input()
    model = args.model
    client = localrag.configure_ollama_client()

@mock_llm.post("/chat")
async def mock_response(request: Request):
    body = await request.json()
    #print(body)
    messages = body.get("messages", [])
    
    if not messages or len(messages) < 2:
        print(messages)
        return {"error": "Invalid message format."}
    
    # Optional: loggen
    # print("\n--- Eingehende Anfrage an Mock-LLM ---")
    # for m in messages:
    #     print(f"{m['role']}: {m['content']}")

    print("messages received. now calling ollama model")
    # Aufruf des Ollama-Modells
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        max_tokens=50,
        temperature=0.1,
        stream=True  # WICHTIG: stream=False für einfache Rückgabe
    )
    print("message retrieved:\n")
    full_response = ""
    for chunk in response:
        content_part = chunk.choices[0].delta.content or ""
        print(NEON_GREEN + content_part + RESET_COLOR, end="", flush=True)
        full_response += content_part
    print("")
    
    return full_response


if __name__ == "__main__":
    uvicorn.run(mock_llm, host="127.0.0.1", port=5000)