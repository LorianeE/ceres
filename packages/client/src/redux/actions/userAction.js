import { createShoppingList } from '../../utils/http/ShoppingClient';
import { UPDATE_USER, LOGOUT_USER, CREATE_NEW_SHOPPING_LIST } from '../constants/UserActionTypes';
import LoginUtils from '../../utils/LoginUtils';
import { beginFetchUser, endFetchUser } from './apiStatusAction';

export function getUserInfo() {
  return (dispatch) => {
    dispatch(beginFetchUser());
    LoginUtils.getUserInfo()
      .then((userInfo) => {
        dispatch(endFetchUser());
        if (userInfo) {
          dispatch({ type: UPDATE_USER, data: { user: userInfo } });
        } else {
          dispatch({ type: LOGOUT_USER });
        }
      })
      .catch(() => {
        dispatch({ type: LOGOUT_USER });
        dispatch(endFetchUser());
      });
  };
}

export function logOut() {
  return (dispatch) => {
    LoginUtils.logout().then(() => dispatch({ type: LOGOUT_USER }));
  };
}

// TODO: Move in a shoppingListAction
export function createNewShoppingList() {
  // TODO: Make a selector of userId ?
  return (dispatch, getState) => {
    const userId = getState().user.id;
    createShoppingList(userId).then((shoppingList) => {
      dispatch({ type: CREATE_NEW_SHOPPING_LIST, data: { shoppingListId: shoppingList.id } });
    });
  };
}
