// render.js: builds the pieces of the page (cards, filters, details).
// Each function receives data and creates HTML elements from it.

const PLACEHOLDER_IMAGE = "images/placeholder.svg";

// ---------- Shared helper ----------

// Creates an <img> for a material. Uses the first photo in its list,
// and falls back to the placeholder if there is none or the file is missing.
function createMaterialImage(material, lazy) {
  const image = document.createElement("img");
  const firstImage = material.images[0];

  image.src = firstImage ? firstImage.src : PLACEHOLDER_IMAGE;
  image.alt = firstImage
    ? firstImage.alt
    : "No photograph available for " + material.name;

  if (lazy) {
    image.loading = "lazy";
  }

  // If the photo file is missing, swap in the placeholder (once only).
  image.addEventListener("error", () => {
    image.src = PLACEHOLDER_IMAGE;
  }, { once: true });

  return image;
}

// ---------- Cards ----------

// Builds one card (an <article> element) for a single material.
export function createMaterialCard(material, onViewDetails) {
  const card = document.createElement("article");
  card.className = "material-card";

  // Photograph
  const imageWrapper = document.createElement("div");
  imageWrapper.className = "material-card__image";
  imageWrapper.appendChild(createMaterialImage(material, true));

  // Category label (shown on the corner of the photo)
  const category = document.createElement("p");
  category.className = "material-card__category";
  category.textContent = material.category;
  imageWrapper.appendChild(category);

  // Text content
  const body = document.createElement("div");
  body.className = "material-card__body";

  const title = document.createElement("h3");
  title.className = "material-card__title";
  title.textContent = material.name;

  const ids = document.createElement("p");
  ids.className = "material-card__ids";
  // Only show the part number if we actually have one.
  ids.textContent = material.partNumber
    ? material.id + " · Part " + material.partNumber
    : material.id;

  const description = document.createElement("p");
  description.className = "material-card__description";
  description.textContent = material.description;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "button";
  button.textContent = "View details";
  button.setAttribute("aria-label", "View details for " + material.name);
  button.addEventListener("click", () => onViewDetails(material));

  body.append(title, ids, description, button);
  card.append(imageWrapper, body);

  return card;
}

// Clears the grid and draws a card for every material in the list.
export function renderMaterialGrid(gridElement, materials, onViewDetails) {
  gridElement.innerHTML = "";
  materials.forEach((material) => {
    gridElement.appendChild(createMaterialCard(material, onViewDetails));
  });
}

// Updates the "Showing X materials" text.
export function renderResultCount(countElement, count) {
  countElement.textContent =
    count === 1 ? "Showing 1 material" : "Showing " + count + " materials";
}

// ---------- Category filters ----------

// Creates the category buttons ("All", "Valves", ...). Runs once.
export function renderCategoryFilters(container, categories, onSelect) {
  container.innerHTML = "";

  ["All", ...categories].forEach((name) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-chip";
    button.textContent = name;
    button.addEventListener("click", () => onSelect(name));
    container.appendChild(button);
  });
}

// Marks the selected category button as active (for the look, and for screen readers).
export function updateActiveFilter(container, selectedCategory) {
  container.querySelectorAll(".filter-chip").forEach((button) => {
    const isSelected = button.textContent === selectedCategory;
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

// ---------- Details view ----------

// Makes one label/value row, e.g. "Part number: GV-2040"
function createDetailRow(label, value) {
  const row = document.createElement("div");
  row.className = "details__row";

  const term = document.createElement("dt");
  term.textContent = label;

  const definition = document.createElement("dd");
  definition.textContent = value;

  row.append(term, definition);
  return row;
}

// Fills the details dialog with one material's information.
export function renderMaterialDetails(container, material, onClose) {
  container.innerHTML = "";

  const layout = document.createElement("div");
  layout.className = "details__layout";

  // Large photograph
  const media = document.createElement("div");
  media.className = "details__media";
  const mainImage = createMaterialImage(material, false);
  media.appendChild(mainImage);

  // Text side
  const info = document.createElement("div");

  const title = document.createElement("h2");
  title.id = "details-title"; // the dialog's aria-labelledby points here
  title.className = "details__title";
  title.textContent = material.name;

  const facts = document.createElement("dl");
  facts.className = "details__list";
  facts.append(
    createDetailRow("Catalogue ID", material.id),
    createDetailRow("Part number", material.partNumber || "Not provided"),
    createDetailRow("Category", material.category)
  );

  const description = document.createElement("p");
  description.textContent = material.description;

  const specsHeading = document.createElement("h3");
  specsHeading.className = "details__heading";
  specsHeading.textContent = "Specifications";

  info.append(title, facts, description, specsHeading);

  // Only list specifications we actually have. Never invent any.
  if (material.specifications.length > 0) {
    const specs = document.createElement("dl");
    specs.className = "details__list";
    material.specifications.forEach((spec) => {
      specs.appendChild(createDetailRow(spec.label, spec.value));
    });
    info.appendChild(specs);
  } else {
    const none = document.createElement("p");
    none.textContent = "Not provided.";
    info.appendChild(none);
  }

  // Back button
  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.className = "button details__back";
  backButton.textContent = "Back to catalogue";
  backButton.addEventListener("click", onClose);
  info.appendChild(backButton);

  // If there is more than one photo, show small thumbnails to switch between them
  const photoColumn = document.createElement("div");
  photoColumn.appendChild(media);

  if (material.images.length > 1) {
    const thumbs = document.createElement("div");
    thumbs.className = "details__thumbs";

    material.images.forEach((photo, index) => {
      const thumb = document.createElement("button");
      thumb.type = "button";
      thumb.className = "details__thumb";
      thumb.setAttribute("aria-label", "Show photo " + (index + 1) + " of " + material.images.length);
      thumb.setAttribute("aria-pressed", String(index === 0));

      const thumbImage = document.createElement("img");
      thumbImage.src = photo.src;
      thumbImage.alt = "";
      thumb.appendChild(thumbImage);

      thumb.addEventListener("click", () => {
        mainImage.src = photo.src;
        mainImage.alt = photo.alt;
        thumbs.querySelectorAll(".details__thumb").forEach((other) => {
          other.setAttribute("aria-pressed", String(other === thumb));
        });
      });

      thumbs.appendChild(thumb);
    });

    photoColumn.appendChild(thumbs);
  }

  layout.append(photoColumn, info);
  container.appendChild(layout);
}
