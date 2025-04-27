import React, { useState, useEffect } from "react";

// Check if browser supports SpeechRecognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognitionButton = SpeechRecognition ? new SpeechRecognition() : null;

export const SpeechRecognitionButton = ({ onTranscript }) => {
  const [isListeningButton, setIsListeningButton] = useState(false);

  useEffect(() => {
    if (!recognitionButton) return;

    recognitionButton.continuous = false; // nur ein Satz pro Aufnahme
    recognitionButton.lang = "en-GB"; // deutsche Sprache

    recognitionButton.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("Erkannt:", transcript);

      // Gebe das Transkript an die übergeordnete Komponente weiter
      if (onTranscript) {
        onTranscript(transcript);
      }
    };

    recognitionButton.onend = () => {
      setIsListeningButton(false);
    };
  }, [onTranscript]);

  const startListening = () => {
    if (!recognitionButton) {
      alert("Dein Browser unterstützt keine Sprachaufnahme.");
      return;
    }
    setIsListeningButton(true);
    recognitionButton.start();
  };

  const stopListening = () => {
    if (!recognitionButton) return;
    recognitionButton.stop();
  };

  const handleButtonClick = () => {
    if (isListeningButton) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={handleButtonClick}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        {isListeningButton
          ? "Aufnahme beenden GEKAPSELT"
          : "Aufnahme starten GEKAPSELT"}
      </button>
    </div>
  );
};

// import React from "react";
// import { useState, useEffect } from "react";

// // Check if browser supports SpeechRecognition
// const SpeechRecognition =
//   window.SpeechRecognition || window.webkitSpeechRecognition;
// const recognitionButton = SpeechRecognition ? new SpeechRecognition() : null;

// export const SpeechRecognitionButton = () => {
//   const [isListeningButton, setIsListeningButton] = useState(false);

//   useEffect(() => {
//     if (!recognitionButton) return;

//     recognitionButton.continuous = false; // nur ein Satz pro Aufnahme
//     recognitionButton.lang = "de-DE"; // deutsche Sprache

//     recognitionButton.onresult = (event) => {
//       const transcript = event.results[0][0].transcript.toLowerCase();
//       console.log("Erkannt:", transcript);

//       // log resulting transcript to console
//       console.log("Transkript: ", transcript);
//     };

//     recognitionButton.onend = () => {
//       setIsListeningButton(false);
//     };
//   }, []);

//   const startListening = () => {
//     if (!recognitionButton) {
//       alert("Dein Browser unterstützt keine Sprachaufnahme.");
//       return;
//     }
//     setIsListeningButton(true);
//     recognitionButton.start();
//   };

//   const stopListening = () => {
//     if (!recognitionButton) return;
//     recognitionButton.stop();
//   };

//   const handleButtonClick = () => {
//     if (isListeningButton) {
//       stopListening();
//     } else {
//       startListening();
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <button
//         onClick={handleButtonClick}
//         style={{ padding: "10px 20px", fontSize: "16px" }}
//       >
//         {isListeningButton
//           ? "Aufnahme beenden GEKAPSELT"
//           : "Aufnahme starten GEKAPSELT"}
//       </button>
//     </div>
//   );
// };
