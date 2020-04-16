import shoppingListData from '../data/shoppingList.json';
import {
  setShoppingListInStorage,
  getShoppingListFromStorage,
} from './StorageUtils';
// import httpClient from './HttpClient';

export async function getShoppingList() {
  let shoppingList = getShoppingListFromStorage();
  if (!shoppingList) {
    // shoppingList = await httpClient.get(
    //   'http://localhost:8080/rest/shoppingLists/1'
    // );
    shoppingList = shoppingListData;
    setShoppingListInStorage(shoppingList);
    return [...shoppingList];
  }
  return shoppingList;
}

export async function saveShoppingList(shoppingList) {
  // const body = shoppingList;
  try {
    setShoppingListInStorage(shoppingList);
    // await httpClient.put('http://localhost:8080/rest/shoppingLists/1', body);
  } catch (err) {
    console.error('Unable to save shopping list to server');
  }
}
