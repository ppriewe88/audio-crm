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
  cumulativeWizardInput,
}) => {
  // display values for instruction steps
  const inputSteps = ["Kunden-ID", "Produkt-ID", "Bestellmenge"];

  return (
    <>
      <p
        className="creation-input"
        style={{
          backgroundColor: sendingButtonActive ? "green" : "lightgray",
          color: sendingButtonActive ? "white" : "black",
        }}
      >
        {[1].includes(stepCounterWizard) &&
          `${inputSteps[0]} einsprechen - dann "Los"!`}
        {[1.5, 2].includes(stepCounterWizard) &&
          `${inputSteps[1]} einsprechen - dann "Los"!`}
        {[2.5, 3].includes(stepCounterWizard) &&
          `${inputSteps[2]} einsprechen - dann "Los"!`}
        {[3.5, 4].includes(stepCounterWizard) && "Daten abgesendet!"}
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
  console.log("DATA:  ", orderData);
  if (!Array.isArray(orderData) || orderData.length === 0) {
    console.log("inside function:", orderData);
    return <div className="creation-data-table-wrapper"> {"    "} </div>;
  }
  console.log("inside makeOrderResults function:", orderData);

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
