import { getFilledShoppingList } from '../../utils/ShoppingListMapper';

export function getShoppingList(state) {
  return state.shoppingList;
}

export function getFullShoppingList(state) {
  return getFilledShoppingList(state.shoppingList.items, state.products.dbList);
}

export function getShelvesForShoppingList(state) {
  return Array.from(new Set(getFilledShoppingList(state.shoppingList.items, state.products.dbList).map((item) => item.product.shelf)));
}
