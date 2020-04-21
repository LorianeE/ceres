import { setShoppingListInStorage, getShoppingListFromStorage } from '../StorageUtils';
import httpClient from './HttpClient';
import * as config from '../../config.json';

export async function getShoppingListItems() {
  let shoppingList = getShoppingListFromStorage();
  // TEMP: default shopping list
  const shoppingListId = config.defaultShoppinglistId;
  if (!shoppingList) {
    shoppingList = await httpClient.get(`/rest/shopping-lists/${shoppingListId}`);
    setShoppingListInStorage(shoppingList);
    return shoppingList.items;
  }
  return shoppingList.items;
}

export async function saveShoppingListItems(shoppingListItems) {
  const shoppingList = getShoppingListFromStorage();
  shoppingList.items = shoppingListItems;
  try {
    setShoppingListInStorage(shoppingList);
    await httpClient.put(`/rest/shopping-lists/${shoppingList.id}`, shoppingList);
    console.log('Successfully saved shopping list to server !');
  } catch (err) {
    console.error('Unable to save shopping list to server');
  }
}
