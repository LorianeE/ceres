import * as types from '../constants/ShoppingActionTypes';

const defaultState = {
  // shoppingItem1: { id: 1, quantity: 2, product: {...} }
};

function shoppingList(state = defaultState, action) {
  switch (action.type) {
    // case types.ADD_ITEM:
    //   return {
    //     ...state,
    //   };
    // case types.REMOVE_ITEM:
    //   return {
    //     ...state,
    //   };
    case types.LOAD_SHOPPING_LIST:
      return action.shoppingList; // L'action va renvoyer toute la liste de course et donc remplacer le state qui EST la liste de course.

    default:
      return state;
  }
}

export default shoppingList;
