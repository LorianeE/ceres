export function getUserId(state) {
  return state.user.id;
}

export function getUserIsLoggedIn(state) {
  return state.user.isLoggedIn;
}

export function getUserDefaultShoppingListId(state) {
  return state.user.shoppingLists?.[0];
}
