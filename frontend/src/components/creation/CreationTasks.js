import { CARD_IDENTIFIERS, CARD_TITLES } from "./CreationCards";

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
