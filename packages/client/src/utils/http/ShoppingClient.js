import { setShoppingListInStorage } from '../StorageUtils';
import httpClient from './HttpClient';
import { mapListFromApiToNormalized, mapListFromNormalizedToApi } from '../ShoppingListMapper';

export async function getShoppingList(shoppingListId) {
  if (shoppingListId) {
    const shoppingList = await httpClient.get(`/rest/shopping-lists/${shoppingListId}`);
    setShoppingListInStorage(shoppingList);
    return mapListFromApiToNormalized(shoppingList);
  }
  throw new Error('No shopping list id.');
}

export async function saveShoppingList(normalizedShoppingList) {
  try {
    const mappedShoppingList = mapListFromNormalizedToApi(normalizedShoppingList);
    setShoppingListInStorage(mappedShoppingList);
    const updatedShoppingList = await httpClient.put(`/rest/shopping-lists/${mappedShoppingList.id}`, mappedShoppingList);
    setShoppingListInStorage(updatedShoppingList);
    return mapListFromApiToNormalized(updatedShoppingList);
  } catch (err) {
    console.error('Unable to save shopping list to server');
    throw err;
  }
}

export async function createShoppingList() {
  const shoppingList = await httpClient.post(`/rest/shopping-lists`, {
    items: [],
  });
  setShoppingListInStorage(shoppingList);
  // No need to normalize shoppingList since it is an empty new one
  return shoppingList;
}
