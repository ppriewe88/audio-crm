import React, { useState } from "react";
import { SpeechRecognitionButtonCreation } from "../speech_recognition/SpeechRecognitionCreation";
import {
  GetStorageLocationsWizard,
  GetStorageLocationsResults,
} from "./getStorageLocations";
import { MakeOrderWizard } from "./makeOrder";
import "./creation.css";

export const CARD_IDENTIFIERS = {
  links: "bestellung anlegen",
  mitte: "lagerort checken",
  rechts: "aufgabe drei",
  a: "aufgabe vier",
  b: "aufgabe 5",
};

export const CARD_TITLES = {
  links: "Bestellung anlegen",
  mitte: "Lagerort checken",
  rechts: "Aufgabe 3",
  a: "Aufgabe 4",
  b: "Aufgabe 4",
};

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
      {activeCard === CARD_IDENTIFIERS.links && (
        <MakeOrderWizard
          sendingButtonActive={sendingButtonActive}
          stepCounterWizard={stepCounterWizard}
          speechInput={speechInput}
        />
      )}
      {activeCard === CARD_IDENTIFIERS.mitte && (
        <GetStorageLocationsWizard
          sendingButtonActive={sendingButtonActive}
          speechInput={speechInput}
        />
      )}
      {activeCard === CARD_IDENTIFIERS.rechts &&
        "Platzhalter (Task-spezifischer Wizard)"}
      {activeCard === null && "Wizard"}
    </div>
  );
};

export const CreationResults = ({ activeCard, infoFromAPI }) => {
  return (
    <div className="creation-results-container">
      {activeCard === CARD_IDENTIFIERS.links && "KOMMT NOCH"}
      {activeCard === CARD_IDENTIFIERS.mitte && (
        <GetStorageLocationsResults infoFromAPI={infoFromAPI} />
      )}
      {activeCard === CARD_IDENTIFIERS.rechts && "KOMMT NOCH"}
    </div>
  );
};
