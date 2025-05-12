// ################ function to get products via api call ####
export const getProducts = async (cumulativeWizardInput, setInfoFromAPI) => {
  // control print
  console.log("Now processing: ", cumulativeWizardInput);

  // ################## API call
  try {
    // Create FormData and append userQuestion
    const formData = new FormData();
    formData.append("wizard_inputs", JSON.stringify(cumulativeWizardInput));

    const response = await fetch("http://localhost:8000/show_products", {
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

// ############# display component for product results (table) #########
export const ProductResults = ({ infoFromAPI, dict }) => {
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
