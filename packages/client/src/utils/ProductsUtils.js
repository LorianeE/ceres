export function sortByLabel(products) {
  if (!products) {
    return [];
  }
  return products.sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });
}
