import { useState } from "react";
import {
  ChatbotQuestioning,
  ChatbotResponse,
} from "./components/retrieval/RetrievalComponents";
import { CreationTasks } from "./components/creation/CreationComponents_new";

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
              <p style={{ textAlign: "center" }}>
                Welcome to an easy local RAG application to retrieve data using
                AI!
              </p>
              <p style={{ textAlign: "center" }}>
                Simply ask the Chatbot and get all the data you need!
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
              <h1>Audio creation tasks!</h1>
              <p style={{ textAlign: "center" }}>Blablabla!</p>
              <p style={{ textAlign: "center" }}>
                Talk to the UI to create data!
              </p>
              <CreationTasks />
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
        }}
        onClick={() => setActiveTab("retrieval")}
      >
        Retriever
      </button>
      <button
        style={{
          width: "50%",
          backgroundColor:
            activeTab === "creationTasks" ? "#5176b5" : "#c9d1df",
          color: activeTab === "creationTasks" ? "#f7f7f7" : "#5176b5",
        }}
        onClick={() => setActiveTab("creationTasks")}
      >
        Creation Tasks
      </button>
    </nav>
  );
};
