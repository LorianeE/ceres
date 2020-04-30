import * as types from '../constants/ShoppingActionTypes';

const defaultState = {};

function shoppingList(state = defaultState, action) {
  switch (action.type) {
    case types.ADD_ITEM:
      return {
        ...state,
      };
    case types.REMOVE_ITEM:
      return {
        ...state,
      };

    default:
      return state;
  }
}

export default shoppingList;
