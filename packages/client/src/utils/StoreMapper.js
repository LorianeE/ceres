export function mapStoreFromApiToNormalized(apiStore) {
  return {
    ...apiStore,
    items: apiStore.items.reduce((normItems, item) => {
      return {
        ...normItems,
        [item.id]: item,
      };
    }, {}),
  };
}

export function mapStoreFromNormalizedToApi(normalizedStore) {
  return {
    ...normalizedStore,
    items: Object.values(normalizedStore.items),
  };
}

function sortStoreAlphabetically(store) {
  return store.sort((a, b) => {
    if (a.product.label < b.product.label) {
      return -1;
    }
    if (a.product.label > b.product.label) {
      return 1;
    }
    return 0;
  });
}

export function getFilledStore(unfilledItems, products) {
  if (!unfilledItems || !products.length) {
    return [];
  }
  const itemsArray = Object.values(unfilledItems);
  return sortStoreAlphabetically(
    itemsArray.map((item) => {
      return {
        ...item,
        product: products.find((product) => product.id === item.product),
      };
    })
  );
}
