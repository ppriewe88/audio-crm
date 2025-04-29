import React, { useState } from "react";
import { SpeechRecognitionButton } from "../speech_recognition/SpeechRecognition";

export const CreationTasks = () => {
  const [activeCard, setActiveCard] = useState(null);

  // handler for transcript received by speech recognition
  const handleTranscript = (transcript) => {
    console.log("Erkannt:", transcript);

    if (transcript.includes("links")) {
      setActiveCard("links");
    } else if (transcript.includes("mitte")) {
      setActiveCard("mitte");
    } else if (transcript.includes("rechts")) {
      setActiveCard("rechts");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div
          style={{
            flex: 1,
            height: "150px",
            backgroundColor: activeCard === "links" ? "red" : "#eee",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "20px",
          }}
        >
          Links
        </div>

        <div
          style={{
            flex: 1,
            height: "150px",
            backgroundColor: activeCard === "mitte" ? "red" : "#eee",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "20px",
          }}
        >
          Mitte
        </div>

        <div
          style={{
            flex: 1,
            height: "150px",
            backgroundColor: activeCard === "rechts" ? "red" : "#eee",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "20px",
          }}
        >
          Rechts
        </div>
      </div>

      <SpeechRecognitionButton
        onTranscript={handleTranscript}
        returnMode="textBlock"
      />
    </div>
  );
};
