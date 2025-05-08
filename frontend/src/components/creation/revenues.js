// #################### helper function #################
export const revenuesCaching = (
  setInfoFromAPI,
  cumulativeWizardInput,
  stepCounterWizard,
  setStepCounterWizard
) => {
  if (stepCounterWizard === 1) {
    setStepCounterWizard(1);
    requestRevenues(setInfoFromAPI, cumulativeWizardInput);
    return;
  }
};

// #################### function to make API call ####
export const requestRevenues = async (
  setInfoFromAPI,
  cumulativeWizardInput
) => {
  // ################## API call
  try {
    // Create FormData and append userQuestion
    const formData = new FormData();
    formData.append("wizard_inputs", JSON.stringify(cumulativeWizardInput));

    const response = await fetch("http://localhost:8000/show_revenues", {
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
}) => {};

// #################### display for results #########
export const RevenuesResults = ({ infoFromAPI, dict }) => {
  const revenueData = infoFromAPI?.revenues;

  if (!Array.isArray(revenueData) || revenueData.length === 0) {
    console.log("inside function:", revenueData);
    return <div className="creation-data-table-wrapper"> {"    "} </div>;
  }
  console.log("inside storageInfo function:", revenueData);
  // creating headers for order table
  const revenueHeaders = [
    "Rechnungs_ID",
    "Umsatz",
    "Rohgewinn",
    "Verkaufspreis",
    "Verkaufspreis_ohne_MWSt",
    "Einkaufspreis",
    "Produkt_ID",
    "Bestellmenge",
    "Kunden_ID",
    "Warengruppe",
    "Lieferanten_ID",
  ];

  return (
    <div className="creation-data-table-wrapper">
      <div className="creation-data-table-scroll">
        <table className="creation-data-table">
          <thead>
            <tr>
              {revenueHeaders.map((header) => (
                <th key={header}> {dict[header] || header || "(empty)"}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {revenueData.map((row, idx) => (
              <tr key={idx}>
                {revenueHeaders.map((header) => (
                  <td key={header}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
