// filters.js: decides which materials match the search and category.
// This file never touches the page. It only works with data,
// which makes it easy to understand and test.

// Returns a sorted list of unique category names, e.g. ["Fasteners", "Valves"]
export function getCategories(materials) {
  const names = materials.map((material) => material.category);
  return [...new Set(names)].sort(); // a Set removes duplicates
}

// Returns only the materials that match BOTH the search text and the category.
export function filterMaterials(materials, searchText, selectedCategory) {
  const query = searchText.trim().toLowerCase();

  return materials.filter((material) => {
    const matchesCategory =
      selectedCategory === "All" || material.category === selectedCategory;

    // Join the searchable fields into one lowercase string, then look inside it.
    const searchableText = [
      material.name,
      material.id,
      material.partNumber || "", // null (unknown) becomes an empty string
      material.description,
    ].join(" ").toLowerCase();

    const matchesSearch = query === "" || searchableText.includes(query);

    return matchesCategory && matchesSearch; // both must be true
  });
}
