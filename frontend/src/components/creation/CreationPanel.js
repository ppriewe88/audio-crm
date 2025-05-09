import React, { useState, useRef } from "react";
import { CreationTasks } from "./CreationTasks";
import { CreationWizard } from "./CreationWizard";
import { CreationResults } from "./CreationResults";
import { SpeechRecognitionButtonCreation } from "../speech_recognition/SpeechRecognitionCreation";
import "./creation.css";

export const CreationPanel = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [displayedSpeechInput, setDisplayedSpeechInput] = useState("");
  const [sendingIsActive, setSendingIsActive] = useState(false);
  const [stepCounterWizard, setStepCounterWizard] = useState(1);
  const [cumulativeWizardInput, setCumulativeWizardInput] = useState([]);
  const [infoFromAPI, setInfoFromAPI] = useState("");
  const [interimInfoFromAPI, setInterimInfoApi] = useState([]);

  const handleTranscript = (transcript) => {
    // console.log("received transcript (handler):", transcript);
    // Only show in textarea if it's not a command
    setDisplayedSpeechInput(transcript);
  };

  return (
    <>
      <SpeechRecognitionButtonCreation
        width="150px"
        onTranscript={handleTranscript}
        returnMode="chunks"
        activeCard={activeCard}
        setActiveCard={setActiveCard}
        setInfoFromAPI={setInfoFromAPI}
        setInterimInfoApi={setInterimInfoApi}
        stepCounterWizard={stepCounterWizard}
        setStepCounterWizard={setStepCounterWizard}
        cumulativeWizardInput={cumulativeWizardInput}
        setCumulativeWizardInput={setCumulativeWizardInput}
        setSendingIsActive={setSendingIsActive}
      />
      <CreationTasks activeCard={activeCard} />
      <div className="creation-container">
        <CreationWizard
          sendingButtonActive={sendingIsActive}
          activeCard={activeCard}
          speechInput={displayedSpeechInput}
          stepCounterWizard={stepCounterWizard}
          cumulativeWizardInput={cumulativeWizardInput}
        />
        <CreationResults
          activeCard={activeCard}
          infoFromAPI={infoFromAPI}
          stepCounterWizard={stepCounterWizard}
          interimInfoFromAPI={interimInfoFromAPI}
        />
      </div>
    </>
  );
};
