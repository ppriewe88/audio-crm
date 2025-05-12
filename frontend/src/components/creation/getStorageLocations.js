import { getProducts } from "./makeOrder";
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
    // ################################################################ initial table with products
    console.log("NOW GETTING DATA");
    getProducts(cumulativeWizardInput, setInfoFromAPI);
    setStepCounterWizard((s) => 2);
    setSendingIsActive(false);
    console.log("wizard step now: ", stepCounterWizard);
    console.log("cumulative wizard input now: ", cumulativeWizardInput);
    return;
  }

  if ([2, 3].includes(stepCounterWizard)) {
    // ################################################################ enter product ID
    //   append lastChunk (speech input) to array of inputs
    setCumulativeWizardInput((current) => [lastChunk]);
    // no rerender yet, so append content temporrarily
    const tempCumulativeWizardInput = lastChunk;
    console.log("ORIGINAL", cumulativeWizardInput);
    console.log("TEMPORÄR", tempCumulativeWizardInput);
    // get inventories for display
    getStorageLocationsGetter(tempCumulativeWizardInput, setInfoFromAPI);
    // increase step counter
    setStepCounterWizard((s) => 3);
    setSendingIsActive(false);
    console.log("wizard step now: ", stepCounterWizard);
    console.log("cumulative wizard input now: ", cumulativeWizardInput);
    return;
  }
};

// #################### getter function #################
export const getStorageLocationsGetter = async (lastChunk, setInfoFromAPI) => {
  // control print
  console.log("Now processing:", lastChunk);
  // const cleanedArticleNr = lastChunk[lastChunk.length - 1];
  const cleanedArticleNr = lastChunk.replace(/\s+/g, "");
  console.log("Cleaned Art.Nr.: ", cleanedArticleNr);

  // ################## API call
  try {
    // Create FormData and append userQuestion
    const formData = new FormData();
    formData.append("articlenumber", cleanedArticleNr);

    const response = await fetch("http://localhost:8000/get_storage_info", {
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
export const GetStorageLocationsWizard = ({
  sendingButtonActive,
  speechInput,
}) => {
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

// #################### display for product results #########
export const GetStorageLocationsProductResults = ({ infoFromAPI, dict }) => {
  const productData = infoFromAPI?.products;
  // console.log("DATA:  ", productData);
  if (!Array.isArray(productData) || productData.length === 0) {
    console.log("inside function:", productData);
    return <div className="creation-data-table-wrapper"> {"    "} </div>;
  }
  // console.log("inside makeOrderResults PRODUCTS function:", productData);
  // creating headers for order table
  const productHeaders = [
    "Produkt_ID",
    "Produktname",
    "Preis",
    "description",
    "Bestand",
    "Mindestbestand",
    "Lagername",
  ];
  return (
    <>
      <h3>Produkte</h3>
      <div className="creation-data-table-wrapper">
        <div className="creation-data-table-scroll">
          <table className="creation-data-table">
            <thead>
              <tr>
                {productHeaders.map((header) => (
                  <th key={header}> {dict[header] || header || "(empty)"}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productData.map((row, idx) => (
                <tr key={idx}>
                  {productHeaders.map((header) => (
                    <td key={header}>{row[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// #################### display for final results #########
export const GetStorageLocationsResults = ({ infoFromAPI }) => {
  const data = infoFromAPI?.query_results;

  if (!Array.isArray(data) || data.length === 0) {
    // console.log("inside function:", data);
    return <div className="creation-data-table-wrapper"> {"    "} </div>;
  }
  // console.log("inside storageInfo function:", data);

  return (
    <div className="creation-data-table-wrapper">
      <div className="creation-data-table-scroll">
        <table className="creation-data-table">
          <thead>
            <tr>
              <th>Lager</th>
              <th>Bestand</th>
              <th>Mindestbestand</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td>{row.name}</td>
                <td>{row.stock}</td>
                <td>{row.min_stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
