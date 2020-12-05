export function mapListFromApiToNormalized(apiShoppinglist) {
  return {
    ...apiShoppinglist,
    items: apiShoppinglist.items.reduce((normItems, item) => {
      return {
        ...normItems,
        [item.id]: item,
      };
    }, {}),
  };
}

export function mapListFromNormalizedToApi(normalizedShoppingList) {
  return {
    ...normalizedShoppingList,
    items: Object.values(normalizedShoppingList.items),
  };
}

function sortListAlphabetically(shoppinglist) {
  return shoppinglist.sort((a, b) => {
    if (a.product.label < b.product.label) {
      return -1;
    }
    if (a.product.label > b.product.label) {
      return 1;
    }
    return 0;
  });
}

export function getFilledShoppingList(unfilledItems, products) {
  if (!unfilledItems || !products.length) {
    return [];
  }
  const itemsArray = Object.values(unfilledItems);
  return sortListAlphabetically(
    itemsArray.map((item) => {
      return {
        ...item,
        product: products.find((product) => product.id === item.product),
      };
    })
  );
}
