import * as _ from 'lodash';
import { getShoppingListFromStorage, setShoppingListInStorage } from '../StorageUtils';
import httpClient from './HttpClient';

function mapShoppingListToApi(shoppingList) {
  const mappedShoppingList = _.cloneDeep(shoppingList);
  mappedShoppingList.items.map((item) => {
    const mappedItem = item;
    mappedItem.product = item.product.id;
    return mappedItem;
  });
  return mappedShoppingList;
}

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
    const mappedShoppingList = mapShoppingListToApi(shoppingList);
    await httpClient.put(`/rest/shopping-lists/${shoppingList.id}`, mappedShoppingList);
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
