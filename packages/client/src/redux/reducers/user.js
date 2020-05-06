import { CREATE_NEW_SHOPPING_LIST } from '../constants/UserActionTypes';
import initialState from '../initialState';

function user(state = initialState.user, action) {
  switch (action.type) {
    case CREATE_NEW_SHOPPING_LIST:
      return {
        ...state,
        shoppingLists: [...state.shoppingLists, action.data.shoppingListId],
      };

    default:
      return state;
  }
}

export default user;
