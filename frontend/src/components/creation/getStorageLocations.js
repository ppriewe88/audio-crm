// #################### getter function #################
export const getStorageLocationsGetter = async (lastChunk, setInfoFromAPI) => {
  // control print
  console.log("Now processing:", lastChunk);
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

// #################### display for results #########
export const GetStorageLocationsResults = ({ infoFromAPI }) => {
  const data = infoFromAPI?.query_results;

  if (!Array.isArray(data) || data.length === 0) {
    console.log("inside function:", data);
    return <div className="creation-data-table-wrapper"> {"    "} </div>;
  }
  console.log("inside storageInfo function:", data);

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
