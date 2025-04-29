import React from "react";
import { useState } from "react";

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
        <button onClick={toggleModal}>
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
        <h3
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          Request validation
        </h3>
        <ControlBox
          controlPart={controlPart}
          caption="user question"
          height="100px"
          controlFragment="user question"
        />
        <ControlBox
          controlPart={controlPart}
          caption="RAG-retrieval: relevant tables"
          height="70px"
          controlFragment="RAG-retrieval (relevant tables)"
        />
        <ControlBox
          controlPart={controlPart}
          caption="SQL query"
          height="200px"
          controlFragment="SQL query"
        />
      </div>
    </div>
  );
};

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
