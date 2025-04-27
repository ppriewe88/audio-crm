import React, { useState, useEffect } from "react";
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

      <SpeechRecognitionButton onTranscript={handleTranscript} />
    </div>
  );
};

// // import React from "react";
// // import { useState, useEffect } from "react";
// // import { SpeechRecognitionButton } from "../speech_recognition/SpeechRecognition";

// // // Check if browser supports SpeechRecognition
// // const SpeechRecognition =
// //   window.SpeechRecognition || window.webkitSpeechRecognition;
// // const recognition = SpeechRecognition ? new SpeechRecognition() : null;

// // export const CreationTasks = () => {
// //   const [isListening, setIsListening] = useState(false);
// //   const [activeCard, setActiveCard] = useState(null);

// //   useEffect(() => {
// //     if (!recognition) return;

// //     recognition.continuous = false; // nur ein Satz pro Aufnahme
// //     recognition.lang = "en-GB"; // deutsche Sprache

// //     recognition.onresult = (event) => {
// //       const transcript = event.results[0][0].transcript.toLowerCase();
// //       console.log("Erkannt:", transcript);

// //       // log resulting transcript to console
// //       console.log("Transkript: ", transcript);

// //       if (transcript.includes("links")) {
// //         setActiveCard("links");
// //       } else if (transcript.includes("mitte")) {
// //         setActiveCard("mitte");
// //       } else if (transcript.includes("rechts")) {
// //         setActiveCard("rechts");
// //       }
// //     };

// //     recognition.onend = () => {
// //       setIsListening(false);
// //     };
// //   }, []);

// //   const startListening = () => {
// //     if (!recognition) {
// //       alert("Dein Browser unterstützt keine Sprachaufnahme.");
// //       return;
// //     }
// //     setIsListening(true);
// //     recognition.start();
// //   };

// //   const stopListening = () => {
// //     if (!recognition) return;
// //     recognition.stop();
// //   };

// //   const handleButtonClick = () => {
// //     if (isListening) {
// //       stopListening();
// //     } else {
// //       startListening();
// //     }
// //   };

// //   return (
// //     <div style={{ padding: "20px" }}>
// //       <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
// //         <div
// //           style={{
// //             flex: 1,
// //             height: "150px",
// //             backgroundColor: activeCard === "links" ? "red" : "#eee",
// //             borderRadius: "10px",
// //             boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
// //             display: "flex",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             fontSize: "20px",
// //           }}
// //         >
// //           Links
// //         </div>

// //         <div
// //           style={{
// //             flex: 1,
// //             height: "150px",
// //             backgroundColor: activeCard === "mitte" ? "red" : "#eee",
// //             borderRadius: "10px",
// //             boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
// //             display: "flex",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             fontSize: "20px",
// //           }}
// //         >
// //           Mitte
// //         </div>

// //         <div
// //           style={{
// //             flex: 1,
// //             height: "150px",
// //             backgroundColor: activeCard === "rechts" ? "red" : "#eee",
// //             borderRadius: "10px",
// //             boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
// //             display: "flex",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             fontSize: "20px",
// //           }}
// //         >
// //           Rechts
// //         </div>
// //       </div>

// //       <button
// //         onClick={handleButtonClick}
// //         style={{ padding: "10px 20px", fontSize: "16px" }}
// //       >
// //         {isListening ? "Aufnahme beenden" : "Aufnahme starten"}
// //       </button>

// //       <SpeechRecognitionButton />
// //     </div>
// //   );
// // };

// import React, { useState, useEffect } from "react";
// import { SpeechRecognitionButton } from "../speech_recognition/SpeechRecognition";

// // Check if browser supports SpeechRecognition
// const SpeechRecognition =
//   window.SpeechRecognition || window.webkitSpeechRecognition;
// const recognition = SpeechRecognition ? new SpeechRecognition() : null;

// export const CreationTasks = () => {
//   const [isListening, setIsListening] = useState(false);
//   const [activeCard, setActiveCard] = useState(null);

//   // Funktion, die ausgeführt wird, wenn ein Transkript erkannt wird
//   const handleSpeechResult = (event) => {
//     const transcript = event.results[0][0].transcript.toLowerCase();
//     console.log("Erkannt:", transcript);

//     if (transcript.includes("links")) {
//       setActiveCard("links");
//     } else if (transcript.includes("mitte")) {
//       setActiveCard("mitte");
//     } else if (transcript.includes("rechts")) {
//       setActiveCard("rechts");
//     }
//   };

//   useEffect(() => {
//     if (!recognition) return;

//     recognition.continuous = false; // nur ein Satz pro Aufnahme
//     recognition.lang = "en-GB"; // englische Sprache

//     recognition.onresult = handleSpeechResult;

//     recognition.onend = () => {
//       setIsListening(false);
//     };
//   }, []); // Hier nur leeres Array, damit der Effekt nur einmal ausgeführt wird

//   const startListening = () => {
//     if (!recognition) {
//       alert("Dein Browser unterstützt keine Sprachaufnahme.");
//       return;
//     }
//     setIsListening(true);
//     recognition.start();
//   };

//   const stopListening = () => {
//     if (!recognition) return;
//     recognition.stop();
//   };

//   const handleButtonClick = () => {
//     if (isListening) {
//       stopListening();
//     } else {
//       startListening();
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
//         <div
//           style={{
//             flex: 1,
//             height: "150px",
//             backgroundColor: activeCard === "links" ? "red" : "#eee",
//             borderRadius: "10px",
//             boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             fontSize: "20px",
//           }}
//         >
//           Links
//         </div>

//         <div
//           style={{
//             flex: 1,
//             height: "150px",
//             backgroundColor: activeCard === "mitte" ? "red" : "#eee",
//             borderRadius: "10px",
//             boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             fontSize: "20px",
//           }}
//         >
//           Mitte
//         </div>

//         <div
//           style={{
//             flex: 1,
//             height: "150px",
//             backgroundColor: activeCard === "rechts" ? "red" : "#eee",
//             borderRadius: "10px",
//             boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             fontSize: "20px",
//           }}
//         >
//           Rechts
//         </div>
//       </div>

//       <button
//         onClick={handleButtonClick}
//         style={{ padding: "10px 20px", fontSize: "16px" }}
//       >
//         {isListening ? "Aufnahme beenden" : "Aufnahme starten"}
//       </button>

//       <SpeechRecognitionButton />
//     </div>
//   );
// };
