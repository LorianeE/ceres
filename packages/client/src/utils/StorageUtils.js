const STORE_KEY = 'appState';

export function setStorageState(state) {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

export function getStorageState() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
  } catch (er) {
    return {};
  }
}

export function setShoppingListInStorage(value) {
  setStorageState({
    ...getStorageState(),
    shoppingList: value,
  });
}

export function getShoppingListFromStorage() {
  return getStorageState().shoppingList;
}
