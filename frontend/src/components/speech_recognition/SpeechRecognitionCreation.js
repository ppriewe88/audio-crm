import React, { useState, useEffect, useRef } from "react";
import { CARD_IDENTIFIERS } from "../creation/CreationComponents";
// Check if browser supports SpeechRecognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognitionButton = SpeechRecognition ? new SpeechRecognition() : null;

export const SpeechRecognitionButtonCreation = ({
  width = "80%",
  onTranscript,
  returnMode = "chunks",
  activeCard,
  setActiveCard,
}) => {
  // ######################### states and constants/variables
  // state for active/inactive button
  const [isListeningButton, setIsListeningButton] = useState(false);
  // language control
  const language = "de-DE"; // Sprache # en-GB oder de-DE
  let stopWord = ""; // stop word for record
  if (language === "de-DE") {
    stopWord = "ende";
  } else if (language === "en-GB" || language === "en-US") {
    stopWord = "stop";
  }

  // ######################### buffer for chunks
  const chunkBufferRef = useRef([]);
  // ######################### buffer for blockage of speech recognition
  const hasHandledCommandRef = useRef(false);
  // ######################### main control flow for speech recognition
  // useEffect to initialize speech recognition and handle results
  useEffect(() => {
    if (!recognitionButton) return;

    // ################ initialize speech recognition
    recognitionButton.continuous = returnMode === "chunks"; // Nur in "chunks"-Modus kontinuierlich
    recognitionButton.interimResults = returnMode === "chunks"; // Nur im "chunks"-Modus Zwischenstände
    recognitionButton.lang = language; // Sprache # en-GE oder de-DE

    // ################ main control flow for speech recognition
    recognitionButton.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        const transcript = result[0].transcript.toLowerCase().trim();

        if (transcript.includes(stopWord)) {
          recognitionButton.stop();
          console.log("recognized stopword; record stopped");
          return;
        }

        if (transcript.includes(CARD_IDENTIFIERS.links)) {
          console.log("BESTELLUNG ANLEGEN");
          setActiveCard(CARD_IDENTIFIERS.links);
        }
        if (transcript.includes(CARD_IDENTIFIERS.mitte)) {
          console.log("LAGERORT CHECKEN");
          onTranscript("");
          setActiveCard(CARD_IDENTIFIERS.mitte);
          // Block speech recognition for short time to avoid buggy interim display of interimTranscripts
          hasHandledCommandRef.current = true;
          setTimeout(() => {
            hasHandledCommandRef.current = false;
          }, 1000); // Reset after 2 seconds
          return;
        }
        if (transcript.includes(CARD_IDENTIFIERS.rechts)) {
          console.log("RECHTS");
          setActiveCard(CARD_IDENTIFIERS.rechts);
        }

        if (result.isFinal) {
          chunkBufferRef.current.push(transcript);
        } else {
          interimTranscript += transcript;
        }
      }

      // onTranscript(chunkBufferRef.current.join(" ")); // Send the final transcript to the parent component
      // Optional: Live-Chunks
      if (
        !hasHandledCommandRef.current &&
        returnMode === "chunks" &&
        interimTranscript.trim() &&
        onTranscript
      ) {
        onTranscript(interimTranscript);
      }
    };

    recognitionButton.onend = () => {
      setIsListeningButton(false);
    };
  });

  // ######################### functions to activate and deactivate speech recognition
  const startListening = () => {
    if (!recognitionButton) {
      alert("Speech recognition is not supported in this browser.");
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

  // ######################### return
  return (
    <div style={{ width: width }}>
      <button
        style={{ width: "100%" }}
        onClick={handleButtonClick}
        className={`button ${isListeningButton ? "recording" : ""}`}
      >
        {isListeningButton ? "Stop recording" : "Start recording"}
      </button>
    </div>
  );
};
