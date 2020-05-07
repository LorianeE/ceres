const isMongoId = (text) => {
  return text.toString().match(/^[0-9a-fA-F]{24}$/);
};

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
  const itemsArray = Object.values(normalizedShoppingList.items);
  // Remove every no-mongodb-ids
  return {
    ...normalizedShoppingList,
    items: itemsArray.map((item) => {
      if (item.id && !isMongoId(item.id)) {
        const apiItem = item;
        delete apiItem.id;
        return apiItem;
      }
      return item;
    }),
  };
}

export function getFilledShoppingList(unfilledItems, products) {
  if (!unfilledItems || !products.length) {
    return [];
  }
  const itemsArray = Object.values(unfilledItems);
  return itemsArray.map((item) => {
    return {
      ...item,
      product: products.find((product) => product.id === item.product),
    };
  });
}
