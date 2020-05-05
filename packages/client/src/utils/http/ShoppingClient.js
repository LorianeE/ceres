import { setShoppingListInStorage } from '../StorageUtils';
import httpClient from './HttpClient';

function mapShoppingListToApi(normalizedShoppingList) {
  return {
    ...normalizedShoppingList,
    items: Object.values(normalizedShoppingList.items),
  };
}

export async function getShoppingList(shoppingListId) {
  if (shoppingListId) {
    const shoppingList = await httpClient.get(`/rest/shopping-lists/${shoppingListId}`);
    setShoppingListInStorage(shoppingList);
    return shoppingList;
  }
  throw new Error('No shopping list id.');
}

export async function saveShoppingList(normalizedShoppingList) {
  try {
    const mappedShoppingList = mapShoppingListToApi(normalizedShoppingList);
    setShoppingListInStorage(mappedShoppingList);
    await httpClient.put(`/rest/shopping-lists/${mappedShoppingList.id}`, mappedShoppingList);
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
