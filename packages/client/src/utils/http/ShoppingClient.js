import { setShoppingListInStorage } from '../StorageUtils';
import httpClient from './HttpClient';
import { mapListFromApiToNormalized, mapListFromNormalizedToApi } from '../ShoppingListMapper';

export async function getShoppingList(userId, shoppingListId) {
  if (shoppingListId) {
    const shoppingList = await httpClient.get(`/rest/users/${userId}/shopping-lists/${shoppingListId}`);
    setShoppingListInStorage(shoppingList);
    return mapListFromApiToNormalized(shoppingList);
  }
  throw new Error('No shopping list id.');
}

export async function saveShoppingList(userId, normalizedShoppingList) {
  const mappedShoppingList = mapListFromNormalizedToApi(normalizedShoppingList);
  // Save to local storage before calling in case call fails
  setShoppingListInStorage(mappedShoppingList);
  const updatedShoppingList = await httpClient.put(`/rest/users/${userId}/shopping-lists/${mappedShoppingList.id}`, mappedShoppingList);
  // Save to local storage after if response from server
  setShoppingListInStorage(updatedShoppingList);
  return mapListFromApiToNormalized(updatedShoppingList);
}

export async function createShoppingList(userId) {
  const shoppingList = await httpClient.post(`/rest/users/${userId}/shopping-lists`, {
    items: [],
  });
  setShoppingListInStorage(shoppingList);
  // No need to normalize shoppingList since it is an empty new one
  return shoppingList;
}
