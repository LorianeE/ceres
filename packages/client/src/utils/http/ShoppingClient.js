import { setShoppingListInStorage } from '../StorageUtils';
import httpClient from './HttpClient';
import { mapListFromApiToNormalized } from '../ShoppingListMapper';

// TODO: Essayer d'utiliser redux-offline plutôt
export async function getShoppingList(userId, shoppingListId) {
  if (shoppingListId) {
    const shoppingList = await httpClient.get(`/rest/users/${userId}/shopping-lists/${shoppingListId}`);
    setShoppingListInStorage(shoppingList);
    return mapListFromApiToNormalized(shoppingList);
  }
  throw new Error('No shopping list id.');
}

export async function postShoppingList(userId, shoppingList) {
  const newShoppingList = await httpClient.post(`/rest/users/${userId}/shopping-lists`, shoppingList);
  setShoppingListInStorage(newShoppingList);
  return mapListFromApiToNormalized(newShoppingList);
}

export async function postItem(userId, shoppingListId, item) {
  return httpClient.post(`/rest/users/${userId}/shopping-lists/${shoppingListId}/items`, item);
}

export async function putItem(userId, shoppingListId, item) {
  return httpClient.put(`/rest/users/${userId}/shopping-lists/${shoppingListId}/items/${item.id}`, item);
}

export async function postShopItemToStore(userId, shoppingListId, itemId, quantityToMove) {
  return httpClient.post(`/rest/users/${userId}/shopping-lists/${shoppingListId}/items/${itemId}/store`, { quantityToMove });
}
