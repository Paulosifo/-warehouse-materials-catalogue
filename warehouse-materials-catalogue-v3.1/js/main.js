// main.js: starts the app and connects the other files together.

import { loadMaterials } from "./data.js";
import { getCategories, filterMaterials } from "./filters.js";
import {
  renderMaterialGrid,
  renderResultCount,
  renderCategoryFilters,
  updateActiveFilter,
  renderMaterialDetails,
} from "./render.js";

// ---------- 1. Find the elements on the page ----------
const grid = document.getElementById("material-grid");
const resultCount = document.getElementById("result-count");
const searchInput = document.getElementById("search-input");
const filterContainer = document.getElementById("category-filters");
const emptyState = document.getElementById("empty-state");
const resetButton = document.getElementById("reset-filters");
const detailsDialog = document.getElementById("details-dialog");
const detailsContent = document.getElementById("details-content");

// ---------- 2. State: the things the page needs to remember ----------
let allMaterials = [];
let searchText = "";
let selectedCategory = "All";

// ---------- 3. Details pop-up ----------
function openDetails(material) {
  renderMaterialDetails(detailsContent, material, closeDetails);
  detailsDialog.showModal();
}

function closeDetails() {
  detailsDialog.close();
}

// ---------- 4. Filter the list and redraw everything that depends on it ----------
function updateCatalogue() {
  const visibleMaterials = filterMaterials(allMaterials, searchText, selectedCategory);

  renderMaterialGrid(grid, visibleMaterials, openDetails);
  renderResultCount(resultCount, visibleMaterials.length);
  updateActiveFilter(filterContainer, selectedCategory);

  // Show the empty message only when nothing matches
  emptyState.hidden = visibleMaterials.length !== 0;

  // Show the reset button only when a filter is active
  const filtersAreActive = searchText.trim() !== "" || selectedCategory !== "All";
  resetButton.hidden = !filtersAreActive;
}

function resetFilters() {
  searchText = "";
  selectedCategory = "All";
  searchInput.value = "";
  updateCatalogue();
}

// ---------- 5. Start ----------
async function startApp() {
  try {
    allMaterials = await loadMaterials();
    const categories = getCategories(allMaterials);

    // Numbers shown in the dark band at the top
    document.getElementById("stat-materials").textContent = allMaterials.length;
    document.getElementById("stat-categories").textContent = categories.length;

    renderCategoryFilters(filterContainer, categories, (name) => {
      selectedCategory = name;
      updateCatalogue();
    });

    // "input" fires on every keystroke
    searchInput.addEventListener("input", () => {
      searchText = searchInput.value;
      updateCatalogue();
    });

    resetButton.addEventListener("click", resetFilters);

    // Clicking the dimmed area outside the panel also closes it
    detailsDialog.addEventListener("click", (event) => {
      if (event.target === detailsDialog) closeDetails();
    });

    updateCatalogue();
  } catch (error) {
    console.error(error);

    // Opening index.html by double-clicking blocks loading the JSON file.
    if (window.location.protocol === "file:") {
      resultCount.textContent =
        "This page must be opened with a local server (for example VS Code Live Server), not by double-clicking the file.";
    } else {
      resultCount.textContent = "Sorry, the catalogue could not be loaded.";
    }
  }
}

startApp();
