import React from "react";
import { useState } from "react";
import { db_dict_de } from "../../dictionaries/database_dicts";
import { systemPrompt } from "./SystemPrompt";
import "./retrieval.css";

// ####################################### ChatbotResponse
// these components are responsible for displaying the response from the LLM
// they will display the data and control parts of the response
export const ChatbotResponse = ({ llmResponse }) => {
  // states to control modals (ControlBoxModal, ER-diagram, LLM system prompt)
  const [isControlSectionVisible, setIsControlSectionVisible] = useState(false);
  const [isERDiagramVisible, setIsERDiagramVisible] = useState(false);
  const [isSystemPromptVisible, setIsSystemPromptVisible] = useState(false);
  const [isWorkflowVisible, setIsWorkflowVisible] = useState(false);
  // handlers to manage modal visibility
  const toggleControlSection = () => {
    setIsControlSectionVisible(!isControlSectionVisible);
  };
  const toggleERDiagram = () => {
    setIsERDiagramVisible(!isERDiagramVisible);
  };
  const toggleSystemPrompt = () => {
    setIsSystemPromptVisible(!isSystemPromptVisible);
  };
  const toggleWorkflow = () => {
    setIsWorkflowVisible(!isWorkflowVisible);
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
      <h3>Daten</h3>
      <div className="data-container">
        <DataBox
          dataPart={dataPart}
          dataFragment={"query_results"}
          dict={db_dict_de}
        />
      </div>
      <div
        className="control-container"
        style={{ flexDirection: "Row", gap: "10px" }}
      >
        <button onClick={toggleControlSection} style={{ width: "22%" }}>
          Kontrollbereich
        </button>
        <ControlBoxModal
          controlPart={controlPart}
          isVisible={isControlSectionVisible}
          onClose={toggleControlSection}
        />
        <button onClick={toggleERDiagram} style={{ width: "22%" }}>
          ER Diagramm
        </button>
        <ERDiagramModal
          isVisible={isERDiagramVisible}
          onClose={toggleERDiagram}
        />
        <button onClick={toggleSystemPrompt} style={{ width: "22%" }}>
          LLM system prompt
        </button>
        <SystemPromptModal
          isVisible={isSystemPromptVisible}
          onClose={toggleSystemPrompt}
        />
        <button onClick={toggleWorkflow} style={{ width: "22%" }}>
          Architektur & Workflow
        </button>
        <WorkflowModal isVisible={isWorkflowVisible} onClose={toggleWorkflow} />
      </div>
    </div>
  );
};

export const DataBox = ({ dataPart, dataFragment, dict }) => {
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
                <th key={header}>{dict[header] || header || "(empty)"}</th>
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
  if (!isVisible) return null; // no rendering when modal not visible

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {" "}
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
          height="120px"
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
          height="240px"
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

export const ERDiagramModal = ({ isVisible, onClose }) => {
  if (!isVisible) return null; // no rendering when modal not visible

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "1300px", width: "80%" }}
      >
        <h3
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          Datenbanktabellen
        </h3>
        <img
          src="/assets/er_diagram.png"
          alt="ER-Diagramm"
          style={{
            maxWidth: "100%",
            height: "auto",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>
    </div>
  );
};

export const SystemPromptModal = ({ isVisible, onClose }) => {
  if (!isVisible) return null; // no rendering when modal not visible

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "1600px", width: "80%" }}
      >
        <h3
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          LMM system prompt
        </h3>
        <pre
          style={{
            whiteSpace: "pre",
            backgroundColor: "#f0f0f0",
            padding: "10px",
            borderRadius: "5px",
            maxHeight: "600px",
            overflowY: "auto",
            fontSize: "0.6em",
          }}
        >
          {systemPrompt[0]}
        </pre>
      </div>
    </div>
  );
};

export const WorkflowModal = ({ isVisible, onClose }) => {
  if (!isVisible) return null; // no rendering when modal not visible

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "1100px", width: "80%" }}
      >
        <h3
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          Architektur & Workflow
        </h3>
        <img
          src="/assets/retriever_workflow.png"
          alt="ER-Diagramm"
          style={{
            maxWidth: "100%",
            height: "auto",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>
    </div>
  );
};
