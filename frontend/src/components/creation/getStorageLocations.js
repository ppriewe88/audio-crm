import { getProducts } from "./shared/Products";
import { getInventories } from "./shared/Inventories";

// #################### helper function #################
export const getInventoryCaching = (
  lastChunk,
  stepCounterWizard,
  setStepCounterWizard,
  cumulativeWizardInput,
  setCumulativeWizardInput,
  setSendingIsActive,
  setInfoFromAPI
) => {
  // control log
  console.log(
    "entered inventory caching with current step ",
    stepCounterWizard
  );
  if (stepCounterWizard === 1) {
    // ########################## initial table with products
    console.log("NOW GETTING DATA");
    getProducts(cumulativeWizardInput, setInfoFromAPI);
    setStepCounterWizard((s) => 2);
    setSendingIsActive(false);
    console.log("wizard step now: ", stepCounterWizard);
    console.log("cumulative wizard input now: ", cumulativeWizardInput);
    return;
  }

  if ([2, 3].includes(stepCounterWizard)) {
    // ######################## enter product ID
    //   append lastChunk (speech input) to array of inputs
    setCumulativeWizardInput((current) => [lastChunk]);
    // no rerender yet, so append content temporrarily
    const tempCumulativeWizardInput = lastChunk;
    console.log("ORIGINAL", cumulativeWizardInput);
    console.log("TEMPORÄR", tempCumulativeWizardInput);
    // get inventories for display
    getInventories(tempCumulativeWizardInput, setInfoFromAPI);
    // increase step counter
    setStepCounterWizard((s) => 3);
    setSendingIsActive(false);
    console.log("wizard step now: ", stepCounterWizard);
    console.log("cumulative wizard input now: ", cumulativeWizardInput);
    return;
  }
};

// #################### input wizard #################
export const GetInventoriesWizard = ({ sendingButtonActive, speechInput }) => {
  return (
    <>
      <p
        className="creation-input"
        style={{
          backgroundColor: sendingButtonActive ? "green" : "lightgray",
          color: sendingButtonActive ? "white" : "black",
        }}
      >
        Produkt-ID einsprechen - dann "Los"!
      </p>
      <textarea className="speech-box" value={speechInput} />
    </>
  );
};
