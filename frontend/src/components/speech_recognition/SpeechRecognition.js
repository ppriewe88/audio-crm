import React, { useState, useEffect } from "react";

// Check if browser supports SpeechRecognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognitionButton = SpeechRecognition ? new SpeechRecognition() : null;

export const SpeechRecognitionButton = ({
  onTranscript,
  returnMode = "textBlock",
}) => {
  const [isListeningButton, setIsListeningButton] = useState(false);
  const language = "de-DE"; // Sprache # en-GB oder de-DE
  let stopWord = ""; // stop word for record
  if (language === "de-DE") {
    stopWord = "ende";
  } else if (language === "en-GB" || language === "en-US") {
    stopWord = "stop";
  }
  useEffect(() => {
    if (!recognitionButton) return;

    recognitionButton.continuous = returnMode === "chunks"; // Nur in "chunks"-Modus kontinuierlich
    recognitionButton.interimResults = returnMode === "chunks"; // Nur im "chunks"-Modus Zwischenstände

    recognitionButton.lang = language; // Sprache # en-GE oder de-DE

    recognitionButton.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        const transcript = result[0].transcript.toLowerCase();

        if (transcript.includes(stopWord)) {
          recognitionButton.stop();
          console.log("Stoppwort erkannt: Aufnahme beendet");
          return; // nicht weitermachen
        }

        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (returnMode === "chunks") {
        const chunk = finalTranscript || interimTranscript;
        if (chunk.trim() && onTranscript) {
          onTranscript(chunk);
        }
      } else if (returnMode === "textBlock") {
        if (event.results[0].isFinal && onTranscript) {
          const transcript = event.results[0][0].transcript.toLowerCase();

          if (transcript.includes("stopp")) {
            recognitionButton.stop();
            console.log("Stoppwort erkannt: Aufnahme beendet");
            return;
          }

          onTranscript(transcript);
        }
      }
    };

    recognitionButton.onend = () => {
      setIsListeningButton(false);
    };
  }, [onTranscript, returnMode]);

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
        className={`button ${isListeningButton ? "recording" : ""}`}
      >
        {isListeningButton
          ? "Aufnahme beenden GEKAPSELT"
          : "Aufnahme starten GEKAPSELT"}
      </button>
    </div>
  );
};

// import React, { useState, useEffect } from "react";

// // Check if browser supports SpeechRecognition
// const SpeechRecognition =
//   window.SpeechRecognition || window.webkitSpeechRecognition;
// const recognitionButton = SpeechRecognition ? new SpeechRecognition() : null;

// export const SpeechRecognitionButton = ({ onTranscript }) => {
//   const [isListeningButton, setIsListeningButton] = useState(false);

//   useEffect(() => {
//     if (!recognitionButton) return;

//     recognitionButton.continuous = false; // nur ein Satz pro Aufnahme
//     recognitionButton.lang = "en-GB"; // deutsche Sprache

//     recognitionButton.onresult = (event) => {
//       const transcript = event.results[0][0].transcript.toLowerCase();
//       console.log("Erkannt:", transcript);

//       // Gebe das Transkript an die übergeordnete Komponente weiter
//       if (onTranscript) {
//         onTranscript(transcript);
//       }
//     };

//     recognitionButton.onend = () => {
//       setIsListeningButton(false);
//     };
//   }, [onTranscript]);

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
