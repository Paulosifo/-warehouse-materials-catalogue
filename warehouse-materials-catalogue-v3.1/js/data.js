// data.js: loads the list of materials.
//
// Today the data comes from a JSON file. Later, when you build the
// FastAPI backend, change the address below to "/api/materials"
// and the rest of the website keeps working unchanged.

const MATERIALS_URL = "data/materials.json";

export async function loadMaterials() {
  const response = await fetch(MATERIALS_URL);

  if (!response.ok) {
    throw new Error("Could not load materials (status " + response.status + ")");
  }

  return response.json();
}
