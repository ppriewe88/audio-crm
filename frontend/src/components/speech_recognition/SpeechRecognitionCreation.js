import React, { useState, useEffect, useRef } from "react";
import { CARD_IDENTIFIERS } from "../creation/CreationCards";
import { getInventoryCaching } from "../creation/getStorageLocations";
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
  const initialQueryDone = useRef(false);

  // #################### objects to determine trigger word actions
  const triggerConfigs = [
    {
      card: CARD_IDENTIFIERS.inventory,
      handler: getInventoryCaching,
    },
    {
      card: CARD_IDENTIFIERS.order,
      handler: makeOrderCaching,
    },
    {
      card: CARD_IDENTIFIERS.invoice,
      handler: payInvoiceCaching,
    },
    { card: CARD_IDENTIFIERS.revenue, handler: revenuesCaching },
  ];

  // ######################## function to handle card switch in useEffect
  const handleCardSwitchNew = (cardIdentifier, handler) => {
    console.log("Switching card! ", cardIdentifier);
    console.log("initialQueryDone: ", initialQueryDone);
    setActiveCard(cardIdentifier);
    if (initialQueryDone.current === false) {
      onTranscript("");
      setInfoFromAPI("");
      setStepCounterWizard(1);
      setCumulativeWizardInput([]);
      handler(
        "",
        1,
        setStepCounterWizard,
        cumulativeWizardInput,
        setCumulativeWizardInput,
        setSendingIsActive,
        setInfoFromAPI
      );
    }
    initialQueryDone.current = !initialQueryDone.current;
    console.log("initialQueryDone: ", initialQueryDone);
    // Block speech recognition for short time to avoid buggy interim display of interimTranscripts
    hasHandledCommandRef.current = true;
    setTimeout(() => {
      hasHandledCommandRef.current = false;
    }, 1000); // Reset after 2 seconds
    return;
  };

  // #################### function to handle trigger word in context of active card
  const checkAndHandleTriggerWord = (
    cardIdentifier,
    transcript,
    innerFunction
  ) => {
    const submittedTrigger =
      activeCard === cardIdentifier && transcript.includes("los");
    if (submittedTrigger) {
      console.log("trigger recognized: ", hasTriggeredSubmitRef);
      hasTriggeredSubmitRef.current = true;
      console.log("chunkBuffer:", chunkBufferRef.current);
      const lastChunk =
        chunkBufferRef.current[chunkBufferRef.current.length - 1];
      innerFunction(
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
      // return "true" to indicate that process was handled. else, return false
      return true;
    } else {
      return false;
    }
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

        // ############## CONDITION: check switches to relevant cards
        for (const { card, handler } of triggerConfigs) {
          if (transcript.includes(card)) {
            handleCardSwitchNew(card, handler);
            return;
          }
        }

        // ############## CONDITION: check card specific submissions
        // objects with trigger config in head of component. loop over objects
        for (const { card, handler } of triggerConfigs) {
          const triggered = checkAndHandleTriggerWord(
            card,
            transcript,
            handler
          );
          if (triggered) return;
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
