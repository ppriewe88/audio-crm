import React, { useState, useEffect, useRef } from "react";
import { CARD_IDENTIFIERS } from "../creation/CreationCards";
import { getStorageLocationsGetter } from "../creation/getStorageLocations";
import { makeOrderCaching } from "../creation/makeOrder";
import { payInvoiceCaching } from "../creation/payInvoice";

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
  setInfoFromAPI,
  setInterimInfoApi,
  stepCounterWizard,
  setStepCounterWizard,
  cumulativeWizardInput,
  setCumulativeWizardInput,
  setSendingIsActive,
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

  // ######################### buffer for storing longer sentences as ref!
  const chunkBufferRef = useRef([]);

  // ######################### ref blockage flags of speech recognition
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
      let cumulativeTranscript = "";

      // ################## looping over events (=interim results!!)
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        const transcript = result[0].transcript.toLowerCase().trim();

        // ################## control print
        console.log("transcript in speech component:", transcript);
        console.log("cumulativeTranscript:", cumulativeTranscript);

        // ################## CONDITION: stop word
        if (transcript.includes(stopWord)) {
          recognitionButton.stop();
          console.log("recognized stopword; record stopped");
          return;
        }

        // ########################### CONDITION: card selection "inventory"
        // ############## check card status. If switching on this card, reset the buffer
        if (transcript.includes(CARD_IDENTIFIERS.inventory)) {
          console.log("LAGERORT CHECKEN");
          onTranscript("");
          setInfoFromAPI("");
          setActiveCard(CARD_IDENTIFIERS.inventory);
          // Block speech recognition for short time to avoid buggy interim display of interimTranscripts
          hasHandledCommandRef.current = true;
          setSendingIsActive(false);
          setTimeout(() => {
            hasHandledCommandRef.current = false;
          }, 1000); // Reset after 2 seconds
          return;
        }
        // ############## check card specific submission "inventory"
        const submitCardInputsStorageLocations =
          activeCard === CARD_IDENTIFIERS.inventory &&
          transcript.includes("los");
        if (submitCardInputsStorageLocations) {
          console.log("Befehl erkannt → Trigger onSubmit");
          console.log("chunkBuffer:", chunkBufferRef.current);
          const lastChunk =
            chunkBufferRef.current[chunkBufferRef.current.length - 1];
          getStorageLocationsGetter(lastChunk, setInfoFromAPI);
          return; // end processing for this loop
        }

        // ########################### CONDITION: card SELECTION "order"
        if (transcript.includes(CARD_IDENTIFIERS.order)) {
          console.log("BESTELLUNG ANLEGEN");
          onTranscript("");
          setInfoFromAPI("");
          setStepCounterWizard(1);
          setCumulativeWizardInput([]);
          setActiveCard(CARD_IDENTIFIERS.order);
          // Block speech recognition for short time to avoid buggy interim display of interimTranscripts
          hasHandledCommandRef.current = true;
          setSendingIsActive(false);
          setTimeout(() => {
            hasHandledCommandRef.current = false;
          }, 1000); // Reset after 2 seconds
          return;
        }

        // ############## check card specific SUBMISSION "order"
        const submitCardInputsMakeOrder =
          activeCard === CARD_IDENTIFIERS.order && transcript.includes("los");
        if (submitCardInputsMakeOrder) {
          console.log("Befehl erkannt → Trigger onSubmit");
          console.log("chunkBuffer:", chunkBufferRef.current);
          const lastChunk =
            chunkBufferRef.current[chunkBufferRef.current.length - 1];
          makeOrderCaching(
            lastChunk,
            stepCounterWizard,
            setStepCounterWizard,
            cumulativeWizardInput,
            setCumulativeWizardInput,
            setSendingIsActive,
            setInfoFromAPI
            // setInterimInfoApi
          );
          // clear transcript, so that text areas are emptied!
          setSendingIsActive(false);
          // clear transcript, so that text areas are emptied!
          onTranscript("");
          return; // end processing for this loop
        }

        // ########################### CONDITION: card selection "invoice"
        if (transcript.includes(CARD_IDENTIFIERS.invoice)) {
          console.log("RECHTS");
          onTranscript("");
          setInfoFromAPI("");
          setInterimInfoApi("");
          setStepCounterWizard(1);
          setCumulativeWizardInput([]);
          setActiveCard(CARD_IDENTIFIERS.invoice);
          // Block speech recognition for short time to avoid buggy interim display of interimTranscripts
          hasHandledCommandRef.current = true;
          setSendingIsActive(false);
          setTimeout(() => {
            hasHandledCommandRef.current = false;
          }, 1000); // Reset after 2 seconds
          return;
        }

        // ############## check card specific SUBMISSION "invoice"
        const submitCardInputsPayInvoice =
          activeCard === CARD_IDENTIFIERS.invoice && transcript.includes("los");
        if (submitCardInputsPayInvoice) {
          console.log("Befehl erkannt → Trigger onSubmit");
          console.log("chunkBuffer:", chunkBufferRef.current);
          const lastChunk =
            chunkBufferRef.current[chunkBufferRef.current.length - 1];
          payInvoiceCaching(
            lastChunk,
            stepCounterWizard,
            setStepCounterWizard,
            cumulativeWizardInput,
            setCumulativeWizardInput,
            setSendingIsActive,
            setInfoFromAPI,
            setInterimInfoApi
          );
          // clear transcript, so that text areas are emptied!
          setSendingIsActive(false);
          // clear transcript, so that text areas are emptied!
          onTranscript("");
          return; // end processing for this loop
        }

        // ########################### CONDITION: final transcript (pause/sentence ending)
        if (result.isFinal) {
          chunkBufferRef.current.push(transcript);
          console.log("chunkBuffer:", chunkBufferRef.current);
          if (activeCard === CARD_IDENTIFIERS.order) {
            setSendingIsActive(true);
          }
          if (activeCard === CARD_IDENTIFIERS.inventory) {
            setSendingIsActive(true);
          }
          if (activeCard === CARD_IDENTIFIERS.invoice) {
            setSendingIsActive(true);
          }
        } else {
          cumulativeTranscript += transcript;
          setSendingIsActive(false);
        }
      }

      // ########################### Live-Chunks ################
      if (
        !hasHandledCommandRef.current &&
        returnMode === "chunks" &&
        cumulativeTranscript.trim() &&
        onTranscript
      ) {
        onTranscript(cumulativeTranscript);
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
        {isListeningButton ? "Aufnahme beenden" : "Aufnahme starten"}
      </button>
    </div>
  );
};
