import { useState } from "react";
// ################################### dummy data
const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
  { id: 3, description: "Charger", quantity: 12, packed: true },
  { id: 4, description: "Pants", quantity: 12, packed: false },
];

// ########################################################### App
export default function App() {
  // state to control children: Form and Placeholder
  const [llmResponse, setLlmResponse] = useState(null);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Smart Data Retriever!</h1>
        <p style={{ textAlign: "center" }}>
          Welcome to an easy local RAG application to retrieve data using AI!
        </p>
        <p style={{ textAlign: "center" }}>
          Simply ask the Chatbot and get all the data you need!
        </p>
        <div className="chatbot-container">
          {/* pass parental state as prop to children! */}
          <ChatbotQuestioning setLlmResponse={setLlmResponse} />
          <ChatbotResponse llmResponse={llmResponse} />
        </div>
      </header>
    </div>
  );
}

// ########################################################### components

// ####################################### ChatbotQuestioning
// this component is responsible for the user input (question)
// it will send the question to the backend and get the response
function ChatbotQuestioning({ setLlmResponse }) {
  // state to manage user question
  const [userQuestion, setUserQuestion] = useState("");
  // handler to manage form submission (question) and response
  async function handleSubmit(e) {
    e.preventDefault();
    //check input for user question
    if (!userQuestion) {
      alert("Please enter a question.");
      return;
    }
    const newQuestion = { userQuestion };
    console.log(newQuestion);
    setUserQuestion("");
    try {
      // Create FormData and append userQuestion
      const formData = new FormData();
      formData.append("question", userQuestion);

      // Send the request to the new endpoint
      const response = await fetch(
        "http://127.0.0.1:8000/get_context_and_send_request",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Response from server:", result);
      // set LLM's response as new state
      setLlmResponse(result);
      // empty out user question
      setUserQuestion("");
    } catch (error) {
      console.error("Error:", error);
      setLlmResponse({ error: "Error occurred during prediction" });
    }
  }

  return (
    <form className="question-container" onSubmit={handleSubmit}>
      <h3>Enter question for chatbot</h3>
      <textarea
        className="question-box"
        type="text"
        placeholder="Enter your question here..."
        value={userQuestion}
        onChange={(e) => {
          console.log(e.target.value);
          setUserQuestion(e.target.value);
        }}
      />
      <button>Submit question</button>
    </form>
  );
}

// ####################################### ChatbotResponse
// these components are responsible for displaying the response from the LLM
// they will display the data and control parts of the response
function ChatbotResponse({ llmResponse }) {
  // if (!llmResponse) use empty data
  // else deconstruct Chatbot response (llmResponse);
  const controlPart = llmResponse
    ? {
        "user question": llmResponse["user question"],
        "RAG-retrieval (relevant tables)":
          llmResponse["RAG-retrieval (relevant tables)"],
        "SQL query": llmResponse.llm_response,
      }
    : {
        "user question": "",
        "RAG-retrieval: relevant tables": "",
        llm_response: "",
      };

  const dataPart = llmResponse
    ? {
        query_results: llmResponse.query_results,
      }
    : {
        query_results: "",
      };

  return (
    <div className="response-container">
      <h3>Retrieved data</h3>
      <DataBoxNew dataPart={dataPart} dataFragment={"query_results"} />
      <h3>Request validation</h3>
      <ControlBox
        controlPart={controlPart}
        caption="user question"
        height="40px"
        controlFragment={"user question"}
      />
      <ControlBox
        controlPart={controlPart}
        caption={"RAG-retrieval: relevant tables"}
        height="40px"
        controlFragment={"RAG-retrieval (relevant tables)"}
      />
      <ControlBox
        controlPart={controlPart}
        caption={"SQL query"}
        height="120px"
        controlFragment={"SQL query"}
      />
    </div>
  );
}

function DataBox({ dataPart, dataFragment }) {
  const data = dataPart[dataFragment];

  let formattedValue = "";

  if (Array.isArray(data)) {
    formattedValue = data
      .map((obj) => {
        const entries = Object.entries(obj)
          .map(([key, value]) => `${key}: ${value};`)
          .join(" ");
        return `{ ${entries} }`;
      })
      .join("\n"); // Jedes Dictionary eigene Zeile
  } else if (typeof data === "object" && data !== null) {
    const entries = Object.entries(data)
      .map(([key, value]) => `${key}: ${value};`)
      .join(" ");
    formattedValue = `{ ${entries} }`;
  } else {
    formattedValue = data ? data.toString() : "";
  }

  return (
    <textarea
      className="data-box"
      value={formattedValue} // {JSON.stringify(dataPart[dataFragment], null, 2)}
      readOnly
    />
  );
}

function DataBoxNew({ dataPart, dataFragment }) {
  const data = dataPart[dataFragment];

  if (!Array.isArray(data) || data.length === 0) {
    return <div className="data-table-wrapper">No Data available yet</div>;
  }

  // Alle Keys (Spaltenüberschriften) aus dem ersten Dict
  const headers = Object.keys(data[0]);

  return (
    <div className="data-table-wrapper">
      <div className="data-table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header || "(empty)"}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {headers.map((header) => (
                  <td key={header}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// ########################################################### ControlBox
function ControlBox({ controlPart, caption, height, controlFragment }) {
  const value = controlPart[controlFragment];
  // check, if content is array (relevant for table names). If so, join with ", ", else use JSON.stringify
  const formattedValue = Array.isArray(value)
    ? value.join(",       ")
    : typeof value === "string"
    ? value.replace(/\\n/g, "\n").trim()
    : JSON.stringify(value, null, 2);
  // check, if content is of type string

  return (
    <div className="control-item">
      <span className="control-caption">{caption}</span>
      <textarea
        className="control-box"
        style={{ height: height }}
        value={formattedValue}
        readOnly
      />
    </div>
  );
}
