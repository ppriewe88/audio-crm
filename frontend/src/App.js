import { useState } from "react";
import { ChatbotQuestioning } from "./components/retrieval/ChatbotQuestioning";
import { ChatbotResponse } from "./components/retrieval/ChatbotResponse";
import { CreationPanel } from "./components/creation/CreationPanel";

// ########################################################### App
export default function App() {
  // state to control children: Form and Placeholder
  const [llmResponse, setLlmResponse] = useState(null);
  // state to control navigation between main components
  const [activeTab, setActiveTab] = useState("retrieval");

  return (
    <div className="App">
      <header className="App-header">
        <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div>
          {activeTab === "retrieval" && (
            <>
              <h1>Smart Data Retriever!</h1>
              <p style={{ textAlign: "center", fontSize: "2.4rem" }}>
                It's RAG-time! Frage die KI nach Daten, Retrieval-Augmented
                Generation ist der Schlüssel!
              </p>
              <div className="chatbot-container">
                {/* pass parental state as prop to children! */}
                <ChatbotQuestioning setLlmResponse={setLlmResponse} />
                <ChatbotResponse llmResponse={llmResponse} />
              </div>
            </>
          )}
          {activeTab === "creationTasks" && (
            <>
              <h1>Audio controlled tasks!</h1>
              <p style={{ textAlign: "center", fontSize: "2.4rem" }}>
                Steuere deine Datenworkflows - ganz ohne Tastatur!
              </p>
              <CreationPanel />
            </>
          )}
        </div>
      </header>
    </div>
  );
}

// ########################################################### components
// ####################################### Navigation Bar
// this component is responsible for the navigation bar
const NavigationBar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="navigation-bar">
      <button
        style={{
          width: "50%",
          backgroundColor: activeTab === "retrieval" ? "#5176b5" : "#c9d1df",
          color: activeTab === "retrieval" ? "#f7f7f7" : "#5176b5",
          marginLeft: "10px",
        }}
        onClick={() => setActiveTab("retrieval")}
      >
        Datenabfragen
      </button>
      <button
        style={{
          width: "50%",
          backgroundColor:
            activeTab === "creationTasks" ? "#5176b5" : "#c9d1df",
          color: activeTab === "creationTasks" ? "#f7f7f7" : "#5176b5",
          marginRight: "10px",
        }}
        onClick={() => setActiveTab("creationTasks")}
      >
        Aufgaben (v1.1)
      </button>
    </nav>
  );
};
