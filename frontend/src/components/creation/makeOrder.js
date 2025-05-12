import { getCustomers } from "./shared/Customers";
import { getProducts } from "./shared/Products";

// #################### helper function #################
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
    // ################################################################ initial table with customers
    console.log("NOW GETTING DATA");
    getCustomers(cumulativeWizardInput, setInfoFromAPI);
    setStepCounterWizard((s) => s + 1);
    setSendingIsActive(false);
    return;
  }

  if (stepCounterWizard === 2) {
    // ################################################################ enter customer ID
    //   append lastChunk (speech input) to array of inputs
    setCumulativeWizardInput((current) => [lastChunk]);
    // get products for display
    getProducts(cumulativeWizardInput, setInfoFromAPI);
    // increase step counter during makeOrder Wizard (hacky solution)
    setStepCounterWizard((s) => s + 1);
    setSendingIsActive(false);
    console.log("wizard step now: ", stepCounterWizard);
    console.log("cumulative wizard input now: ", cumulativeWizardInput);
    return;
  }
  if (stepCounterWizard === 3) {
    // ################################################################ enter product ID
    //   append lastChunk (speech input) to array of inputs
    setCumulativeWizardInput((current) => [...current, lastChunk]);
    // increase step counter during makeOrder Wizard
    setStepCounterWizard((s) => s + 1);
    setSendingIsActive(false);
    console.log("wizard step now: ", stepCounterWizard);
    console.log("cumulative wizard input now: ", cumulativeWizardInput);
    return;
  }
  if (stepCounterWizard === 4) {
    // ################################################################ enter quantity
    //   append lastChunk (speech input) to array of inputs
    setCumulativeWizardInput((current) => [...current, lastChunk]);
    // no rerender yet, so append content temporrarily
    const tempCumulativeWizardInput = [...cumulativeWizardInput, lastChunk];
    console.log("ORIGINAL", cumulativeWizardInput);
    console.log("TEMPORÄR", tempCumulativeWizardInput);
    // now make order (insert into database and get results)
    makeOrderInserter(tempCumulativeWizardInput, setInfoFromAPI);
    // increase step counter during makeOrder Wizard
    setStepCounterWizard((s) => s + 1);
    setTimeout(() => {
      setCumulativeWizardInput([]);
      setStepCounterWizard(1);
    }, 30000);
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
  cumulativeWizardInput,
}) => {
  // display values for instruction steps
  const inputSteps = ["Kunden-ID", "Produkt-ID", "Bestellmenge"];

  return (
    <>
      <p
        className="creation-input"
        style={{
          backgroundColor:
            sendingButtonActive && stepCounterWizard > 1
              ? "green"
              : "lightgray",
          color:
            sendingButtonActive && stepCounterWizard > 1 ? "white" : "black",
        }}
      >
        {[1, 2].includes(stepCounterWizard) &&
          `${inputSteps[0]} einsprechen - dann "Los"!`}
        {[3].includes(stepCounterWizard) &&
          `${inputSteps[1]} einsprechen - dann "Los"!`}
        {[4].includes(stepCounterWizard) &&
          `${inputSteps[2]} einsprechen - dann "Los"!`}
        {[5].includes(stepCounterWizard) && "Daten abgesendet!"}
      </p>
      <textarea className="speech-box" value={speechInput} />
      {cumulativeWizardInput.map((item, index) => (
        <span className="creation-input" key={index}>
          {inputSteps[index]}
          {":  "}
          {item}
        </span>
      ))}
    </>
  );
};

// #################### display for results #########
export const MakeOrderResults = ({ infoFromAPI, dict }) => {
  const orderData = infoFromAPI?.order;
  const invoiceData = infoFromAPI?.invoice;
  const pairData = infoFromAPI?.pair;
  // console.log("DATA:  ", orderData);
  if (!Array.isArray(orderData) || orderData.length === 0) {
    console.log("inside function:", orderData);
    return <div className="creation-data-table-wrapper"> {"    "} </div>;
  }
  // console.log("inside makeOrderResults function:", orderData);

  // creating headers for order table
  const orderHeaders = [
    "order_id",
    "customer_id",
    "product_id",
    "quantity",
    "status",
  ];
  // creating headers for invoice table
  const invoiceHeaders = [
    "id",
    "order_id",
    "total_price",
    "total_discount",
    "total_price_discounted",
    "due_limit",
    "Zahltag",
    "overdue_fee",
    "status",
  ];
  // creating headers for order-invoice-pair table
  const pairHeaders = [
    "Bestell_ID",
    "Bestellstatus",
    "Auftragseingang",
    "Kunden_ID",
    "Produkt_ID",
    "Bestellmenge",
    "Rechnungs_ID",
    "Umsatz",
    "rabattierter_Umsatz",
    "Mahngebühr",
    "Zahlungsfrist",
    "Zahltag",
    "Rechnungsstatus",
    "Status_Auftrag",
  ];
  return (
    <>
      <h3>Bestellung</h3>
      <div className="creation-data-table-wrapper">
        <div className="creation-data-table-scroll">
          <table className="creation-data-table">
            <thead>
              <tr>
                {orderHeaders.map((header) => (
                  <th key={header}> {dict[header] || header || "(empty)"}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderData.map((row, idx) => (
                <tr key={idx}>
                  {orderHeaders.map((header) => (
                    <td key={header}>{row[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <h3>Rechnung</h3>
      <div className="creation-data-table-wrapper">
        <div className="creation-data-table-scroll">
          <table className="creation-data-table">
            <thead>
              <tr>
                {invoiceHeaders.map((header) => (
                  <th key={header}> {dict[header] || header || "(empty)"}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoiceData.map((row, idx) => (
                <tr key={idx}>
                  {invoiceHeaders.map((header) => (
                    <td key={header}>{row[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <h3>Auftrag</h3>
      <div className="creation-data-table-wrapper">
        <div className="creation-data-table-scroll">
          <table className="creation-data-table">
            <thead>
              <tr>
                {pairHeaders.map((header) => (
                  <th key={header}> {dict[header] || header || "(empty)"}</th>
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
  );
};
