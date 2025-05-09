import React, { useState, useEffect, useRef } from "react";
import { CARD_IDENTIFIERS } from "../creation/CreationCards";
import { getStorageLocationsGetter } from "../creation/getStorageLocations";
import { makeOrderCaching } from "../creation/makeOrder";
import { payInvoiceCaching } from "../creation/payInvoice";
import { revenuesCaching } from "../creation/revenues";

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

  // ######################## ref blockage if trigger word has been recognized once
  const hasTriggeredSubmitRef = useRef(false);
  const revenuesActive = useRef(false);

  // ######################## function to handle card switch in useEffect
  const handleCardSwitch = (cardIdentifier) => {
    console.log("Switching card! ", cardIdentifier);
    onTranscript("");
    setInfoFromAPI("");
    setStepCounterWizard(1);
    setCumulativeWizardInput([]);
    revenuesActive.current = false;
    setActiveCard(cardIdentifier);
    // Block speech recognition for short time to avoid buggy interim display of interimTranscripts
    hasHandledCommandRef.current = true;
    setSendingIsActive(false);
    setTimeout(() => {
      hasHandledCommandRef.current = false;
    }, 1000); // Reset after 2 seconds
  };

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

        // ################## CONDITION: stop word
        if (transcript.includes(stopWord)) {
          recognitionButton.stop();
          console.log("recognized stopword; record stopped");
          return;
        }

        // early skip, if trigger word (command) has been recognized once already
        if (hasTriggeredSubmitRef.current && transcript.includes("los")) {
          console.log("Trigger was recognized already. Wait for final");
          continue;
        }

        // ########################### CONDITION: card selection "inventory"
        // ############## check card status. If switching on this card, reset the buffer
        if (transcript.includes(CARD_IDENTIFIERS.inventory)) {
          handleCardSwitch(CARD_IDENTIFIERS.inventory);
          return;
        }
        // ############## check card specific submission "inventory"
        const submitCardInputsStorageLocations =
          activeCard === CARD_IDENTIFIERS.inventory &&
          transcript.includes("los");
        if (submitCardInputsStorageLocations) {
          console.log("trigger recognized: ", hasTriggeredSubmitRef);
          hasTriggeredSubmitRef.current = true; // "los" has been triggered
          console.log("chunkBuffer:", chunkBufferRef.current);
          const lastChunk =
            chunkBufferRef.current[chunkBufferRef.current.length - 1];
          getStorageLocationsGetter(lastChunk, setInfoFromAPI);
          // reset display of instruction field!
          setSendingIsActive(false);
          // clear transcript, so that text areas are emptied!
          onTranscript("");
          return; // end processing for this loop
        }

        // ########################### CONDITION: card SELECTION "order"
        if (transcript.includes(CARD_IDENTIFIERS.order)) {
          handleCardSwitch(CARD_IDENTIFIERS.order);
          return;
        }

        // ############## check card specific SUBMISSION "order"
        const submitCardInputsMakeOrder =
          activeCard === CARD_IDENTIFIERS.order && transcript.includes("los");
        if (submitCardInputsMakeOrder) {
          console.log("trigger recognized: ", hasTriggeredSubmitRef);
          hasTriggeredSubmitRef.current = true; // "los" has been triggered
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
          );
          // reset display of instruction field!
          setSendingIsActive(false);
          // clear transcript, so that text areas are emptied!
          onTranscript("");
          return; // end processing for this loop
        }

        // ########################### CONDITION: card selection "invoice"
        if (transcript.includes(CARD_IDENTIFIERS.invoice)) {
          handleCardSwitch(CARD_IDENTIFIERS.invoice);
          return;
        }

        // ############## check card specific SUBMISSION "invoice"
        const submitCardInputsPayInvoice =
          activeCard === CARD_IDENTIFIERS.invoice && transcript.includes("los");
        if (submitCardInputsPayInvoice) {
          console.log("trigger recognized: ", hasTriggeredSubmitRef);
          hasTriggeredSubmitRef.current = true; // "los" has been triggered
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
            setInfoFromAPI
          );
          // clear transcript, so that text areas are emptied!
          setSendingIsActive(false);
          // clear transcript, so that text areas are emptied!
          onTranscript("");
          return; // end processing for this loop
        }

        // ########################### CONDITION: card SELECTION "revenue"
        if (transcript.includes(CARD_IDENTIFIERS.revenue)) {
          console.log("UMSAETZE ANZEIGEN");
          console.log("YYYYYYYYYYYYYYY: ", revenuesActive);
          if (revenuesActive.current === false) {
            onTranscript("");
            setInfoFromAPI("");
            setCumulativeWizardInput([]);
            revenuesCaching(
              setInfoFromAPI,
              cumulativeWizardInput,
              1,
              setStepCounterWizard
            );
          }
          setActiveCard(CARD_IDENTIFIERS.revenue);
          revenuesActive.current = true;
          console.log("in UMSÄTZE jetzt AKTIVIEREN: ", revenuesActive);
          // Block speech recognition for short time to avoid buggy interim display of interimTranscripts
          hasHandledCommandRef.current = true;
          setSendingIsActive(false);
          setTimeout(() => {
            hasHandledCommandRef.current = false;
          }, 1000); // Reset after 2 seconds
          return;
        }

        // ########################### CONDITION: final transcript (pause/sentence ending)
        if (result.isFinal) {
          hasTriggeredSubmitRef.current = false;
          console.log("ISFINAL -- hastriggeredsubmit: ", hasTriggeredSubmitRef);
          chunkBufferRef.current.push(transcript);
          console.log("ISFINAL -- chunkbuffer:", chunkBufferRef.current);
          setSendingIsActive(true);
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
