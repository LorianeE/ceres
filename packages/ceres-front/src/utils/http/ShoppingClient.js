import { setShoppingListInStorage, getShoppingListFromStorage } from '../StorageUtils';
import httpClient from './HttpClient';

export async function getShoppingListItems() {
  let shoppingList = getShoppingListFromStorage();
  // TEMP: default shopping list
  const shoppingListId = '5e996f50de4a3b507450ded5';
  if (!shoppingList) {
    shoppingList = await httpClient.get(`http://localhost:8083/rest/shopping-lists/${shoppingListId}`);
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
    await httpClient.put(`http://localhost:8083/rest/shopping-lists/${shoppingList.id}`, shoppingList);
    console.log('Successfully saved shopping list to server !');
  } catch (err) {
    console.error('Unable to save shopping list to server');
  }
}
