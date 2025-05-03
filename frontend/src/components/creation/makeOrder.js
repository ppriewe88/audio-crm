// #################### helper function ++++++++++
export const makeOrderCaching = (
  lastChunk,
  stepCounterWizard,
  setStepCounterWizard,
  cumulativeWizardInput,
  setCumulativeWizardInput,
  setSendingIsActive,
  setInfoFromAPI
) => {
  // control log
  console.log("entered making order with current step ", stepCounterWizard);
  if (stepCounterWizard === 1) {
    //   append lastChunk (speech input) to array of inputs
    setCumulativeWizardInput((current) => [lastChunk]);
    // increase step counter during makeOrder Wizard (hacky solution)
    setStepCounterWizard((s) => s + 0.5);
    setSendingIsActive(false);
    console.log("wizard step now: ", stepCounterWizard);
    console.log("cumulative wizard input now: ", cumulativeWizardInput);
    return;
  }
  if (stepCounterWizard === 1.5) {
    setStepCounterWizard((s) => s + 0.5);
  }
  if (stepCounterWizard === 2) {
    //   append lastChunk (speech input) to array of inputs
    setCumulativeWizardInput((current) => [...current, lastChunk]);
    // increase step counter during makeOrder Wizard
    setStepCounterWizard((s) => s + 0.5);
    setSendingIsActive(false);
    console.log("wizard step now: ", stepCounterWizard);
    console.log("cumulative wizard input now: ", cumulativeWizardInput);
    return;
  }
  if (stepCounterWizard === 2.5) {
    setStepCounterWizard((s) => s + 0.5);
  }
  if (stepCounterWizard === 3) {
    //   append lastChunk (speech input) to array of inputs
    setCumulativeWizardInput((current) => [...current, lastChunk]);
    // increase step counter during makeOrder Wizard
    setStepCounterWizard((s) => s + 0.5);
    console.log("wizard step now: ", stepCounterWizard);
    console.log("cumulative wizard input now: ", cumulativeWizardInput);
    return;
  }
  if (stepCounterWizard === 3.5) {
    makeOrderInserter(cumulativeWizardInput, setInfoFromAPI);
    setStepCounterWizard((s) => s + 0.5);
  }
  if (stepCounterWizard === 4) {
    console.log("last step reached. NOW CALLING API!");
    makeOrderInserter(cumulativeWizardInput, setInfoFromAPI);
    setStepCounterWizard(1);
    setSendingIsActive(false);
    setCumulativeWizardInput([]);
    console.log("wizard step now: ", stepCounterWizard);
    console.log("cumulative wizard input now: ", cumulativeWizardInput);
    return;
  }
};

// #################### function to make API call ####
export const makeOrderInserter = async (
  cumulativeWizardInput,
  setInfoFromAPI
) => {
  // control print
  console.log("Now processing: ", cumulativeWizardInput);

  // ################## API call
  try {
    // Create FormData and append userQuestion
    const formData = new FormData();
    formData.append("wizard_inputs", JSON.stringify(cumulativeWizardInput));

    const response = await fetch("http://localhost:8000/insert_order", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    setInfoFromAPI(result);
    console.log("Response from server:", result);
  } catch (error) {
    console.error("Error:", error);
  }
};

// #################### input wizard #################
export const MakeOrderWizard = ({
  sendingButtonActive,
  speechInput,
  stepCounterWizard,
}) => {
  return (
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
        {[1].includes(stepCounterWizard) &&
          'Kundennummer einsprechen - dann "Los"!'}
        {[1.5, 2].includes(stepCounterWizard) &&
          'Produkt-ID einsprechen - dann "Los"!'}
        {[2.5, 3].includes(stepCounterWizard) &&
          'Bestellmenge einsprechen - dann "Los"!'}
        {[3.5, 4].includes(stepCounterWizard) && "Daten abgesendet!"}
      </p>
      <textarea className="speech-box" value={speechInput} />
    </>
  );
};
