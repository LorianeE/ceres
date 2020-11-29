import { createShoppingList } from '../../utils/http/ShoppingClient';
import { UPDATE_USER, LOGOUT_USER, CREATE_NEW_SHOPPING_LIST } from '../constants/UserActionTypes';
import LoginUtils from '../../utils/http/LoginClient';
import { beginFetchUser, endFetchUser } from './apiStatusAction';

export function getUserInfo() {
  return async (dispatch) => {
    dispatch(beginFetchUser());
    try {
      const userInfo = await LoginUtils.getUserInfo();
      dispatch(endFetchUser());
      if (userInfo) {
        dispatch({ type: UPDATE_USER, data: { user: userInfo } });
      } else {
        dispatch({ type: LOGOUT_USER });
      }
    } catch (err) {
      dispatch(endFetchUser());
      dispatch({ type: LOGOUT_USER });
    }
  };
}

export function logOut() {
  return async (dispatch) => {
    await LoginUtils.logout();
    dispatch({ type: LOGOUT_USER });
  };
}

// TODO: Move in a shoppingListAction
export function createNewShoppingList() {
  return async (dispatch, getState) => {
    const userId = getState().user.id;
    // Ici on devrait plutôt récupérer la liste en sortie de createShoppingList et actualiser toute la nouvelle shopping
    // list avec. D'ailleurs y'a RECEIVED_SHOPPING_LIST_SUCCESS qui fait ça ?
    const shoppingList = await createShoppingList(userId);
    dispatch({ type: CREATE_NEW_SHOPPING_LIST, data: { shoppingListId: shoppingList.id } });
  };
}
