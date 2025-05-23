import React from "react";
import { useState } from "react";
import { SpeechRecognitionButtonRetrieval } from "../speech_recognition/SpeechRecognitionRetrieval";
import "./retrieval.css";

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

      // Send the request to endpoint
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
    console.log("recognized text:", transcript);
    setUserQuestion(transcript); // Update the text area with the transcribed text
  };

  return (
    <div className="question-container">
      <h3>Datenanfrage an KI stellen</h3>
      <SpeechRecognitionButtonRetrieval
        onTranscript={handleTranscript}
        returnMode="chunks" // "textBlock" or "chunks"
      />
      <form className="question-form" onSubmit={handleSubmit}>
        <textarea
          className="question-box"
          type="text"
          placeholder="...hier Anfrage eingeben..."
          value={userQuestion}
          onChange={(e) => {
            console.log(e.target.value);
            setUserQuestion(e.target.value);
          }}
        />
        <button>Anfrage abschicken</button>
      </form>
    </div>
  );
};
