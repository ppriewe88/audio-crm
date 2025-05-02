import React, { useState, useRef } from "react";
import { SpeechRecognitionButtonCreation } from "../speech_recognition/SpeechRecognitionCreation";
import "./creation.css";

export const CARD_IDENTIFIERS = {
  links: "bestellung anlegen",
  mitte: "lagerort checken",
  rechts: "rechts",
};

export const CARD_TITLES = {
  links: "Bestellung anlegen",
  mitte: "Lagerort checken",
  rechts: "rechts",
};

export const CreationPanel = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [displayedSpeechInput, setDisplayedSpeechInput] = useState("");

  const handleTranscript = (transcript) => {
    console.log("recognized:", transcript);
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
      />
      <CreationTasks activeCard={activeCard} />
      <div className="creation-container">
        <CreationWizard
          activeCard={activeCard}
          speechInput={displayedSpeechInput}
        />
        <CreationResults />
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

export const CreationWizard = ({ activeCard, speechInput }) => {
  return (
    <div className="creation-control-container">
      {activeCard === CARD_IDENTIFIERS.mitte ? (
        <>
          <p style={{ marginLeft: "30px" }}>Artikelnummer einsprechen</p>
          <textarea className="speech-box" value={speechInput} />
        </>
      ) : (
        "Platzhalter"
      )}
    </div>
  );
};

const handleActionBasedOnCard = (activeCard, interimSpeechInput) => {
  console.log(activeCard);
  switch (activeCard) {
    case CARD_IDENTIFIERS.links:
      // Logik für die "Links"-Karte
      console.log("Abschicken für die 'Links' Karte!");
      submitInput(interimSpeechInput);
      break;
    case CARD_IDENTIFIERS.mitte:
      // Logik für die "Mitte"-Karte
      console.log("Abschicken für die 'Mitte' Karte!");
      submitInput(interimSpeechInput);
      break;
    case CARD_IDENTIFIERS.rechts:
      // Logik für die "Rechts"-Karte
      console.log("Abschicken für die 'Rechts' Karte!");
      submitInput(interimSpeechInput);
      break;
    default:
      console.log("Kein aktiver Card-Status gefunden.");
  }
};

const submitInput = (interimSpeechInput) => {
  console.log("Absenden des Textes:", interimSpeechInput);
  // Hier kannst du den API-Call einbauen, den du später einfügst.
  // Zum Beispiel:
  // fetch("your-api-endpoint", {
  //   method: "POST",
  //   body: JSON.stringify({ text: speechInput }),
  //   headers: { "Content-Type": "application/json" }
  // });
};

export const CreationResults = () => {
  return <div className="creation-results-container">Platzhalter</div>;
};
