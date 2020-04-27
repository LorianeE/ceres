import { getShoppingListFromStorage, setShoppingListInStorage } from '../StorageUtils';
import httpClient from './HttpClient';

export async function getShoppingListItems(shoppingListId) {
  if (shoppingListId) {
    const shoppingList = await httpClient.get(`/rest/shopping-lists/${shoppingListId}`);
    setShoppingListInStorage(shoppingList);
    return shoppingList.items;
  }
  return null;
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

export async function createShoppingList() {
  const shoppingList = await httpClient.post(`/rest/shopping-lists`, {
    items: [],
  });
  setShoppingListInStorage(shoppingList);
  return shoppingList;
}
