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
  const [sendingButtonActive, setSendingButtonActive] = useState(false);
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
        setSendingButtonActive={setSendingButtonActive}
        setInfoFromAPI={setInfoFromAPI}
      />
      <CreationTasks activeCard={activeCard} />
      <div className="creation-container">
        <CreationWizard
          sendingButtonActive={sendingButtonActive}
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

export const CreationWizard = ({
  activeCard,
  sendingButtonActive,
  speechInput,
}) => {
  return (
    <div className="creation-control-container">
      {activeCard === CARD_IDENTIFIERS.mitte ? (
        <>
          <p
            style={{
              marginLeft: "30px",
              backgroundColor: sendingButtonActive ? "green" : "lightgray",
              color: sendingButtonActive ? "white" : "black",
              borderRadius: "5px",
              marginRight: "25px",
              padding: "5px",
              fontSize: "1.6rem",
            }}
          >
            Artikelnummer einsprechen - dann "Los"!
          </p>
          <textarea className="speech-box" value={speechInput} />
          {/* <button>Los!</button> */}
        </>
      ) : (
        "Platzhalter"
      )}
    </div>
  );
};

export const CreationResults = ({ infoFromAPI }) => {
  return (
    <div className="creation-results-container">
      <StorageInfo infoFromAPI={infoFromAPI} />
    </div>
  );
};

export const StorageInfo = ({ infoFromAPI }) => {
  const data = infoFromAPI;

  if (!Array.isArray(data) || data.length === 0) {
    return <div className="creation-data-table-wrapper"> {"    "} </div>;
  }
  console.log("inside function:", data);
  // Alle Keys (Spaltenüberschriften) aus dem ersten Dict
  const headers = Object.keys(data);

  return (
    <div className="creation-data-table-wrapper">
      <div className="creation-data-table-scroll">
        <table className="creation-data-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header || "(empty)"}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {headers.map((header) => (
                  <td key={header}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
