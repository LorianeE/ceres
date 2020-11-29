import { nanoid } from 'nanoid';
import {
  RECEIVED_SHOPPING_LIST_SUCCESS,
  RECEIVED_SHOPPING_LIST_FAILURE,
  CHANGE_SHOPPING_ITEM_QUANTITY,
  CHANGE_SHOPPING_ITEM_COMMENT,
  ADD_ITEM,
  SAVE_SHOPPING_LIST_FAILURE,
} from '../constants/ShoppingActionTypes';
import { beginApiCall } from './apiStatusAction';
import { getErrMsg, isAppOffline } from './ErrorUtils';
import { getShoppingList, saveShoppingList } from '../../utils/http/ShoppingClient';

function fetchShoppingListSuccess(shoppinglist) {
  return { type: RECEIVED_SHOPPING_LIST_SUCCESS, data: { list: shoppinglist } };
}
function fetchShoppingListFailure(err) {
  return { type: RECEIVED_SHOPPING_LIST_FAILURE, data: { errMsg: getErrMsg(err) } };
}

export function fetchShoppingList(shoppingListId) {
  return async (dispatch, getState) => {
    const userId = getState().user.id;
    dispatch(beginApiCall());

    try {
      const shoppinglist = await getShoppingList(userId, shoppingListId);
      dispatch(fetchShoppingListSuccess(shoppinglist));
    } catch (err) {
      dispatch(fetchShoppingListFailure(err));
    }
  };
}

function changeItemQuantity(itemId, quantityToAdd) {
  return { type: CHANGE_SHOPPING_ITEM_QUANTITY, data: { itemId, quantityToAdd } };
}

function changeItemComment(itemId, comment) {
  return { type: CHANGE_SHOPPING_ITEM_COMMENT, data: { itemId, comment } };
}

function addItem(item) {
  return { type: ADD_ITEM, data: { item: { id: nanoid(), ...item } } };
}

function saveShoppingListAction() {
  return async (dispatch, getState) => {
    dispatch(beginApiCall());
    const userId = getState().user.id;

    try {
      const updatedShoppingList = await saveShoppingList(userId, getState().shoppingList);
      dispatch(fetchShoppingListSuccess(updatedShoppingList));
    } catch (err) {
      if (isAppOffline(err)) {
        dispatch({
          type: SAVE_SHOPPING_LIST_FAILURE,
          data: { errMsg: "Application hors ligne. La liste n'a pas pu être sauvegardée sur le serveur. " },
        });
      } else {
        dispatch({ type: SAVE_SHOPPING_LIST_FAILURE, data: { errMsg: 'Impossible de sauvegarder la liste de courses.' } });
      }
    }
  };
}

// TODO: A cause des deux dispatchs sur ces fonctions ci-dessous on a 2 fois le rendu sur le front.
export function changeItemQuantityAndSave(itemId, quantityToAdd) {
  return (dispatch) => {
    dispatch(changeItemQuantity(itemId, quantityToAdd));
    dispatch(saveShoppingListAction());
  };
}
export function changeItemCommentAndSave(itemId, comment) {
  return (dispatch) => {
    dispatch(changeItemComment(itemId, comment));
    dispatch(saveShoppingListAction());
  };
}

export function addItemAndSave(item) {
  return (dispatch) => {
    dispatch(addItem(item));
    dispatch(saveShoppingListAction());
  };
}
