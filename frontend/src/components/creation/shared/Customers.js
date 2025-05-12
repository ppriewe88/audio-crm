// ###################### function to get customers via api call
export const getCustomers = async (cumulativeWizardInput, setInfoFromAPI) => {
  // control print
  console.log("Now processing: ", cumulativeWizardInput);

  // ################## API call
  try {
    // Create FormData and append userQuestion
    const formData = new FormData();
    formData.append("wizard_inputs", JSON.stringify(cumulativeWizardInput));

    const response = await fetch("http://localhost:8000/show_customers", {
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

// ################# display component for results (customer table) #########
export const CustomerResults = ({ infoFromAPI, dict }) => {
  const customerData = infoFromAPI?.customers;
  // console.log("DATA:  ", productData);
  if (!Array.isArray(customerData) || customerData.length === 0) {
    console.log("inside function:", customerData);
    return <div className="creation-data-table-wrapper"> {"    "} </div>;
  }
  // console.log("inside makeOrderResults PRODUCTS function:", productData);
  // creating headers for order table
  const customerHeaders = ["id", "name", "email", "city", "address"];
  return (
    <>
      <h3>Kunden</h3>
      <div className="creation-data-table-wrapper">
        <div className="creation-data-table-scroll">
          <table className="creation-data-table">
            <thead>
              <tr>
                {customerHeaders.map((header) => (
                  <th key={header}> {dict[header] || header || "(empty)"}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customerData.map((row, idx) => (
                <tr key={idx}>
                  {customerHeaders.map((header) => (
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
