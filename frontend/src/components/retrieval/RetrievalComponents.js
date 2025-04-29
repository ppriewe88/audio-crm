import React from "react";
import { useState } from "react";
import { SpeechRecognitionButton } from "../speech_recognition/SpeechRecognition";

// ####################################### ChatbotQuestioning
// this component is responsible for the user input (question)
// it will send the question to the backend and get the response
export const ChatbotQuestioning = ({ setLlmResponse }) => {
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

  // handler for transcript received by speech recognition
  const handleTranscript = (transcript) => {
    console.log("Erkannt:", transcript);
    setUserQuestion(transcript); // Update the text area with the transcribed text
  };

  return (
    <div className="question-container">
      <h3>Enter question for chatbot</h3>
      <SpeechRecognitionButton
        onTranscript={handleTranscript}
        returnMode="chunks" // "textBlock" or "chunks"
      />
      <form className="question-form" onSubmit={handleSubmit}>
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
    </div>
  );
};

// ####################################### ChatbotResponse
// these components are responsible for displaying the response from the LLM
// they will display the data and control parts of the response
export const ChatbotResponse = ({ llmResponse }) => {
  // state to control modal (ControlBoxModal)
  const [isModalVisible, setIsModalVisible] = useState(false);
  // handler to manage modal visibility
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
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
      <div className="data-container">
        <DataBox dataPart={dataPart} dataFragment={"query_results"} />
      </div>
      <div className="control-container">
        <button
          onClick={toggleModal}
          style={{ marginBottom: "10px", padding: "10px", fontSize: "14px" }}
        >
          {isModalVisible ? "Close Control Section" : "Show Control Section"}
        </button>
        <ControlBoxModal
          controlPart={controlPart}
          isVisible={isModalVisible}
          onClose={toggleModal}
        />
      </div>
    </div>
  );
};

export const DataBox = ({ dataPart, dataFragment }) => {
  const data = dataPart[dataFragment];

  if (!Array.isArray(data) || data.length === 0) {
    return <div className="data-table-wrapper"> {"    "} </div>;
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
};

export const ControlBoxModal = ({ controlPart, isVisible, onClose }) => {
  if (!isVisible) return null; // Nichts rendern, wenn das Modal nicht sichtbar ist

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {" "}
        {/* Stoppt das Propagieren des Klicks */}
        {/* <button className="close-button" onClick={onClose}>
          &times;
        </button> */}
        <h3>Request validation</h3>
        <ControlBox
          controlPart={controlPart}
          caption="user question"
          height="40px"
          controlFragment="user question"
        />
        <ControlBox
          controlPart={controlPart}
          caption="RAG-retrieval: relevant tables"
          height="40px"
          controlFragment="RAG-retrieval (relevant tables)"
        />
        <ControlBox
          controlPart={controlPart}
          caption="SQL query"
          height="120px"
          controlFragment="SQL query"
        />
      </div>
    </div>
  );
};

// ########################################################### ControlBox
export const ControlBox = ({
  controlPart,
  caption,
  height,
  controlFragment,
}) => {
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
};
