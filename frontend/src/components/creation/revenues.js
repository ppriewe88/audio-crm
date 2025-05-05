// #################### helper function #################
export const revenuesCaching = async (
  lastChunk,
  stepCounterWizard,
  setStepCounterWizard,
  cumulativeWizardInput,
  setCumulativeWizardInput,
  setSendingIsActive,
  setInfoFromAPI,
  setInterimInfoApi
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
    // step 1.5: get order-invoice pairs (with unpaid invoices) from user
    await requestRevenues(
      cumulativeWizardInput,
      setInfoFromAPI,
      setInterimInfoApi,
      stepCounterWizard
    );
    setStepCounterWizard((s) => s + 0.5);
  }
  if (stepCounterWizard === 2) {
    //   append lastChunk (speech input) to array of inputs
    setCumulativeWizardInput((current) => [...current, lastChunk]);
    console.log(cumulativeWizardInput);
    // increase step counter during makeOrder Wizard
    setStepCounterWizard((s) => s + 0.5);
    setSendingIsActive(false);
    console.log("wizard step now: ", stepCounterWizard);
    console.log("cumulative wizard input now: ", cumulativeWizardInput);
    return;
  }
  if (stepCounterWizard === 2.5) {
    // step 2.5: pay chosen invoice
    requestRevenues(
      cumulativeWizardInput,
      setInfoFromAPI,
      setInterimInfoApi,
      stepCounterWizard
    );
    // step 1.5: update table
    requestRevenues(
      cumulativeWizardInput,
      setInfoFromAPI,
      setInterimInfoApi,
      1.5
    );
    setTimeout(() => {
      setStepCounterWizard(2);
    }, 300);
  }
  if (stepCounterWizard === 3) {
    console.log("last step reached. CHECK COUNTING!!");
    return;
  }
};

// #################### function to make API call ####
export const requestRevenues = async (
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
export const RevenuesWizard = ({
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
        {[2.5, 3, 3.5].includes(stepCounterWizard) && "Daten abgesendet!"}
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
export const RevenuesResults = ({
  infoFromAPI,
  interimInfoFromAPI,
  dict,
  stepCounterWizard,
}) => {
  const pairData = interimInfoFromAPI?.pairs;

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
      {[1].includes(stepCounterWizard) && "X"}
      {[1.5, 2].includes(stepCounterWizard) && (
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
