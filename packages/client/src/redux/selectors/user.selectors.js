export function getUserId(state) {
  return state.user.id;
}

export function getUserDefaultShoppingListId(state) {
  return state.user.shoppingLists[0];
}
