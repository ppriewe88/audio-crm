import React, { useState } from "react";
import { SpeechRecognitionButton } from "../speech_recognition/SpeechRecognition";
import "./creation.css";

export const CreationTasks = () => {
  // state for task cards
  const [activeCard, setActiveCard] = useState(null);
  // constants for card identification (speech!)
  const CARD_IDENTIFIERS = {
    links: "links",
    mitte: "mitte",
    rechts: "rechts",
  };
  // handler for transcript received by speech recognition
  const handleTranscript = (transcript) => {
    console.log("recognized:", transcript);

    if (transcript.includes(CARD_IDENTIFIERS.links)) {
      setActiveCard(CARD_IDENTIFIERS.links);
    } else if (transcript.includes(CARD_IDENTIFIERS.mitte)) {
      setActiveCard(CARD_IDENTIFIERS.mitte);
    } else if (transcript.includes(CARD_IDENTIFIERS.rechts)) {
      setActiveCard(CARD_IDENTIFIERS.rechts);
    }
  };

  return (
    <div className="tasks-container">
      <div className="cards-container">
        <SpeechRecognitionButton
          width="150px"
          onTranscript={handleTranscript}
          returnMode="textBlock"
        />
        <TaskCard
          activeCard={activeCard}
          cardIdent={CARD_IDENTIFIERS.links}
          cardTitle="Links"
        />
        <TaskCard
          activeCard={activeCard}
          cardIdent={CARD_IDENTIFIERS.mitte}
          cardTitle="Mitte"
        />
        <TaskCard
          activeCard={activeCard}
          cardIdent={CARD_IDENTIFIERS.rechts}
          cardTitle="Rechts"
        />
        <TaskCard
          activeCard={activeCard}
          cardIdent={CARD_IDENTIFIERS.rechts}
          cardTitle="Platzhalter"
        />
        <TaskCard
          activeCard={activeCard}
          cardIdent={CARD_IDENTIFIERS.rechts}
          cardTitle="Platzhalter"
        />
        <TaskCard
          activeCard={activeCard}
          cardIdent={CARD_IDENTIFIERS.rechts}
          cardTitle="Platzhalter"
        />
        <TaskCard
          activeCard={activeCard}
          cardIdent={CARD_IDENTIFIERS.rechts}
          cardTitle="Platzhalter"
        />
      </div>
    </div>
  );
};

const TaskCard = ({ activeCard, cardIdent, cardTitle }) => {
  return (
    <div
      className="card"
      style={{ backgroundColor: activeCard === cardIdent ? "red" : "#eee" }}
    >
      {cardTitle}
    </div>
  );
};

export const CreationWizard = () => {
  return <div className="creation-control-container">Platzhalter</div>;
};

export const CreationResults = () => {
  return <div className="creation-results-container">Platzhalter</div>;
};
