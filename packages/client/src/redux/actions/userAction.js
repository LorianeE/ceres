import { createShoppingList } from '../../utils/http/ShoppingClient';
import { UPDATE_USER, LOGOUT_USER, CREATE_NEW_SHOPPING_LIST } from '../constants/UserActionTypes';
import LoginUtils from '../../utils/LoginUtils';
import { beginApiCall, endApiCall } from './apiStatusAction';

export function getUserInfo() {
  return (dispatch) => {
    dispatch(beginApiCall());
    LoginUtils.getUserInfo()
      .then((userInfo) => {
        if (userInfo) {
          dispatch({ type: UPDATE_USER, data: { user: userInfo } })
        } else {
          dispatch({ type: LOGOUT_USER });
        }
        dispatch(endApiCall());
      })
      .catch(() => {
        dispatch({ type: LOGOUT_USER });
        dispatch(endApiCall());
      });
  };
}

export function logOut() {
  return (dispatch) => {
    LoginUtils.logout().then(() => dispatch({ type: LOGOUT_USER }));
  };
}

export function createNewShoppingList() {
  return (dispatch) => {
    createShoppingList().then((shoppingList) => {
      dispatch({ type: CREATE_NEW_SHOPPING_LIST, data: { shoppingListId: shoppingList.id } });
    });
  };
}
