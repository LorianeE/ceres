import { UPDATE_USER, LOGOUT_USER, CREATE_NEW_SHOPPING_LIST } from '../constants/UserActionTypes';
import initialState from '../initialState';

function user(state = initialState.user, action) {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...action.data.user,
        isLoggedIn: true,
      };
    case LOGOUT_USER:
      return {
        isLoggedIn: false,
      };
    case CREATE_NEW_SHOPPING_LIST:
      if (state.isLoggedIn) {
        return {
          ...state,
          shoppingLists: [...state.shoppingLists, action.data.shoppingListId],
        };
      }
      return state;

    default:
      return state;
  }
}

export default user;
