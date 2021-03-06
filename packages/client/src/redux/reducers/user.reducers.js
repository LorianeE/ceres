import { UPDATE_USER, LOGOUT_USER, CREATE_NEW_SHOPPING_LIST } from '../constants/UserActionTypes';
import initialState from '../initialState';

function userReducers(state = initialState.user, action) {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...action.payload.user,
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
          shoppingLists: [...state.shoppingLists, action.payload.list.id],
        };
      }
      return state;

    default:
      return state;
  }
}

export default userReducers;
