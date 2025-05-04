// #################### helper function #################
export const payInvoiceCaching = (
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
    processInvoicePaymentStepwise(
      cumulativeWizardInput,
      setInfoFromAPI,
      stepCounterWizard
    );
    setStepCounterWizard((s) => s + 0.5);
  }
  if (stepCounterWizard === 2) {
    //   append lastChunk (speech input) to array of inputs
    setCumulativeWizardInput((current) => [lastChunk]);
    console.log(cumulativeWizardInput);
    // increase step counter during makeOrder Wizard
    setStepCounterWizard((s) => s + 0.5);
    setSendingIsActive(false);
    console.log("wizard step now: ", stepCounterWizard);
    console.log("cumulative wizard input now: ", cumulativeWizardInput);
    return;
  }
  if (stepCounterWizard === 2.5) {
    // processInvoicePaymentStepwise(
    //   cumulativeWizardInput,
    //   setInfoFromAPI,
    //   stepCounterWizard
    // );
    setStepCounterWizard((s) => s + 0.5);
  }
  if (stepCounterWizard === 3) {
    console.log("last step reached. NOW CALLING API!");
    processInvoicePaymentStepwise(
      cumulativeWizardInput,
      setInfoFromAPI,
      stepCounterWizard
    );
    setStepCounterWizard(1);
    // setCumulativeWizardInput([]);
    console.log("wizard step now: ", stepCounterWizard);
    console.log("cumulative wizard input now: ", cumulativeWizardInput);
    return;
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
  console.log("now at step: ", stepCounterWizard);
  // depenging on step, choose different endpoints
  let endpoint = "";
  if (stepCounterWizard === 1.5) {
    endpoint = "http://localhost:8000/get_pairs_for_customer";
  } else if (stepCounterWizard === 2) {
    endpoint = "http://localhost:8000/pay_invoice";
  }

  console.log(endpoint);
  // ################## API call
  try {
    // Create FormData and append userQuestion
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
        {[1].includes(stepCounterWizard) &&
          `${inputSteps[0]} einsprechen - dann "Los"!`}
        {[1.5, 2].includes(stepCounterWizard) &&
          `${inputSteps[1]} einsprechen - dann "Los"!`}
        {[2.5, 3].includes(stepCounterWizard) && "Daten abgesendet!"}
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
export const PayInvoiceResults = ({ infoFromAPI, dict, stepCounterWizard }) => {
  const invoiceData = infoFromAPI?.invoice;
  const pairData = infoFromAPI?.pairs;
  // console.log("DATA:  ", orderData);
  if (!Array.isArray(pairData) || pairData.length === 0) {
    console.log("inside function:", pairData);
    return <div className="creation-data-table-wrapper"> {"    "} </div>;
  }
  console.log("inside PayInvoiceResults function:", pairData);

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
      {[1].includes(stepCounterWizard) && "X"}
      {[1.5, 2].includes(stepCounterWizard) && (
        <>
          <h3>Aufträge</h3>
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
      {[2.5, 3].includes(stepCounterWizard) && (
        <>
          <h3>Bestellung</h3>
          <div className="creation-data-table-wrapper">
            <div className="creation-data-table-scroll">
              <table className="creation-data-table">
                <thead>
                  <tr>
                    {orderHeaders.map((header) => (
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
                      <th key={header}>
                        {" "}
                        {dict[header] || header || "(empty)"}
                      </th>
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
