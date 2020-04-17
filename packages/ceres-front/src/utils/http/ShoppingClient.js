import {
  setShoppingListInStorage,
  getShoppingListFromStorage,
} from '../StorageUtils';
import httpClient from './HttpClient';

export async function getShoppingList() {
  let shoppingList = getShoppingListFromStorage();
  const shoppingListId = '5e996f50de4a3b507450ded5';
  if (!shoppingList) {
    const response = await httpClient.get(
      `http://localhost:8083/rest/shoppingLists/${shoppingListId}`
    );
    shoppingList = response.items;
    setShoppingListInStorage(shoppingList);
    return [...shoppingList];
  }
  return shoppingList;
}

export async function saveShoppingList(shoppingList) {
  const shoppingListId = '5e996f50de4a3b507450ded5';
  const body = {
    items: shoppingList,
  };
  try {
    setShoppingListInStorage(shoppingList);
    await httpClient.put(
      `http://localhost:8083/rest/shoppingLists/${shoppingListId}`,
      body
    );
    console.log('Successfully saved shopping list to server !');
  } catch (err) {
    console.error('Unable to save shopping list to server');
  }
}
