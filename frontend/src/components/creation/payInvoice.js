import { getCustomers } from "./shared/Customers";
// #################### helper function #################
export const payInvoiceCaching = async (
  lastChunk,
  stepCounterWizard,
  setStepCounterWizard,
  cumulativeWizardInput,
  setCumulativeWizardInput,
  setSendingIsActive,
  setInfoFromAPI
) => {
  // control log
  console.log("entered paying invoice with current step ", stepCounterWizard);
  if (stepCounterWizard === 1) {
    // ################################################################ initial table with customers
    console.log("NOW GETTING DATA");
    getCustomers(cumulativeWizardInput, setInfoFromAPI);
    setStepCounterWizard((s) => s + 1);
    setSendingIsActive(false);
    return;
  }
  if (stepCounterWizard === 2) {
    // ############################################# show incoives of customer
    //   append lastChunk (speech input) to array of inputs
    setCumulativeWizardInput((current) => [lastChunk]);
    // no rerender yet, so append content temporarily
    const tempCumulativeWizardInput = [...cumulativeWizardInput, lastChunk];
    console.log("ORIGINAL", cumulativeWizardInput);
    console.log("TEMPORÄR", tempCumulativeWizardInput);
    // now get invoices of customer
    await processInvoicePaymentStepwise(
      tempCumulativeWizardInput,
      setInfoFromAPI,
      2
    );
    // increase step counter during makeOrder Wizard (hacky solution)
    setStepCounterWizard((s) => s + 1);
    setSendingIsActive(false);
    console.log("wizard step now: ", stepCounterWizard);
    console.log("cumulative wizard input now: ", cumulativeWizardInput);
    return;
  }
  if (stepCounterWizard === 3) {
    // ####################################### pay invoice
    //   append lastChunk (speech input) to array of inputs
    setCumulativeWizardInput((current) => [...current, lastChunk]);
    // no rerender yet, so append content temporarily
    const tempCumulativeWizardInput = [...cumulativeWizardInput, lastChunk];
    console.log("ORIGINAL", cumulativeWizardInput);
    console.log("TEMPORÄR", tempCumulativeWizardInput);
    // now pay chosen invoice
    processInvoicePaymentStepwise(tempCumulativeWizardInput, setInfoFromAPI, 3);
    // now update table again
    processInvoicePaymentStepwise(tempCumulativeWizardInput, setInfoFromAPI, 2);
    // increase step counter during makeOrder Wizard
    setStepCounterWizard((s) => s + 1);
    setSendingIsActive(false);
    setTimeout(() => {
      setStepCounterWizard(3);
    }, 1000);
  }
};

// #################### function to make API call ####
export const processInvoicePaymentStepwise = async (
  cumulativeWizardInput,
  setInfoFromAPI,
  stepCounterWizard
) => {
  // control print
  console.log("entering");
  console.log("Now processing: ", cumulativeWizardInput);
  // depenging on step, choose different endpoints
  let endpoint = "";
  if (stepCounterWizard === 2) {
    endpoint = "http://localhost:8000/get_pairs_for_customer";
    console.log("now at step: ", stepCounterWizard);
  } else if (stepCounterWizard === 3) {
    endpoint = "http://localhost:8000/pay_invoice";
    console.log("now at step: ", stepCounterWizard);
  }

  console.log(endpoint);
  // ################## API call
  try {
    // Create FormData and append input
    const formData = new FormData();
    formData.append("wizard_inputs", JSON.stringify(cumulativeWizardInput));

    const response = await fetch(endpoint, {
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
export const PayInvoiceWizard = ({
  sendingButtonActive,
  speechInput,
  stepCounterWizard,
  cumulativeWizardInput,
}) => {
  // display values for instruction steps
  const inputSteps = ["Kunden-ID", "Rechnungs-ID"];

  return (
    <>
      <p
        className="creation-input"
        style={{
          backgroundColor: sendingButtonActive ? "green" : "lightgray",
          color: sendingButtonActive ? "white" : "black",
        }}
      >
        {[1, 2].includes(stepCounterWizard) &&
          `${inputSteps[0]} einsprechen - dann "Los"!`}
        {[3].includes(stepCounterWizard) &&
          `${inputSteps[1]} einsprechen - dann "Los"!`}
        {[4].includes(stepCounterWizard) && "Daten abgesendet!"}
      </p>
      <textarea className="speech-box" value={speechInput} />
      {cumulativeWizardInput.map((item, index) => (
        <span className="creation-input" key={index}>
          {index === 0 ? inputSteps[0] : inputSteps[1]}
          {":  "}
          {item}
          {index === 0 ? "" : " bezahlt"}
        </span>
      ))}
    </>
  );
};

// #################### display for results #########
export const PayInvoiceResults = ({ infoFromAPI, dict, stepCounterWizard }) => {
  const pairData = infoFromAPI?.pairs;

  // console.log("DATA:  ", orderData);
  if (!Array.isArray(pairData) || pairData.length === 0) {
    console.log("inside function:", pairData);
    return <div className="creation-data-table-wrapper"> {"    "} </div>;
  }
  console.log("inside PayInvoiceResults function:", pairData);

  // creating headers for order-invoice-pair table
  const pairHeaders = [
    "Status_Auftrag",
    "Rechnungsstatus",
    "Rechnungs_ID",
    "Umsatz",
    "rabattierter_Umsatz",
    "Produkt_ID",
    "produkt_name",
    "Bestellmenge",
    "Mahngebühr",
    "Auftragseingang",
    "Zahltag",
  ];
  return (
    <>
      {[3].includes(stepCounterWizard) && (
        <>
          <h3>Unbezahlte Aufträge</h3>
          <div className="creation-data-table-wrapper">
            <div className="creation-data-table-scroll">
              <table className="creation-data-table">
                <thead>
                  <tr>
                    {pairHeaders.map((header) => (
                      <th key={header}>
                        {" "}
                        {dict[header] || header || "(empty)"}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pairData.map((row, idx) => (
                    <tr key={idx}>
                      {pairHeaders.map((header) => (
                        <td key={header}>{row[header]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};
