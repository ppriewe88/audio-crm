export const getStorageLocations = async (lastChunk, setStorageInfo) => {
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
    setStorageInfo(result);
    console.log("Response from server:", result);
  } catch (error) {
    console.error("Error:", error);
  }
};
