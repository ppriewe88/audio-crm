import React, { useState } from "react";
import { CARD_IDENTIFIERS, CARD_TITLES } from "./CreationCards";
import { SpeechRecognitionButtonCreation } from "../speech_recognition/SpeechRecognitionCreation";
import {
  GetStorageLocationsWizard,
  GetStorageLocationsResults,
} from "./getStorageLocations";
import { MakeOrderWizard, MakeOrderResults } from "./makeOrder";
import { db_dict_de } from "../../dictionaries/database_dicts";
import "./creation.css";

export const CreationPanel = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [displayedSpeechInput, setDisplayedSpeechInput] = useState("");
  const [sendingIsActive, setSendingIsActive] = useState(false);
  const [stepCounterWizard, setStepCounterWizard] = useState(1);
  const [cumulativeWizardInput, setCumulativeWizardInput] = useState([]);
  const [infoFromAPI, setInfoFromAPI] = useState("");

  const handleTranscript = (transcript) => {
    console.log("received transcript (handler):", transcript);
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
        />
        <CreationResults activeCard={activeCard} infoFromAPI={infoFromAPI} />
      </div>
    </>
  );
};

export const CreationTasks = ({ activeCard }) => {
  return (
    <div className="tasks-container">
      <div className="cards-container">
        {Object.entries(CARD_IDENTIFIERS).map(([key, ident]) => (
          <TaskCard
            key={key}
            activeCard={activeCard}
            cardIdent={ident}
            cardTitle={CARD_TITLES[key]}
          />
        ))}
      </div>
    </div>
  );
};

const TaskCard = ({ activeCard, cardIdent, cardTitle }) => {
  return (
    <div
      className="card"
      style={{
        backgroundColor: activeCard === cardIdent ? "red" : "#eee",
        color: activeCard === cardIdent ? "white" : "black",
      }}
    >
      {cardTitle}
    </div>
  );
};

export const CreationWizard = ({
  activeCard,
  sendingButtonActive,
  speechInput,
  stepCounterWizard,
}) => {
  return (
    <div className="creation-control-container">
      {activeCard === CARD_IDENTIFIERS.order && (
        <MakeOrderWizard
          sendingButtonActive={sendingButtonActive}
          stepCounterWizard={stepCounterWizard}
          speechInput={speechInput}
        />
      )}
      {activeCard === CARD_IDENTIFIERS.inventory && (
        <GetStorageLocationsWizard
          sendingButtonActive={sendingButtonActive}
          speechInput={speechInput}
        />
      )}
      {activeCard === CARD_IDENTIFIERS.invoice &&
        "Platzhalter (Task-spezifischer Wizard)"}
      {activeCard === null && "Wizard"}
    </div>
  );
};

export const CreationResults = ({ activeCard, infoFromAPI }) => {
  return (
    <div className="creation-results-container">
      {activeCard === CARD_IDENTIFIERS.order && (
        <MakeOrderResults infoFromAPI={infoFromAPI} dict={db_dict_de} />
      )}
      {activeCard === CARD_IDENTIFIERS.inventory && (
        <GetStorageLocationsResults infoFromAPI={infoFromAPI} />
      )}
      {activeCard === CARD_IDENTIFIERS.invoice && "KOMMT NOCH"}
    </div>
  );
};
