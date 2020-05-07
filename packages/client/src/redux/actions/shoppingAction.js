import _ from 'lodash';
import {
  RECEIVED_SHOPPING_LIST_SUCCESS,
  RECEIVED_SHOPPING_LIST_FAILURE,
  CHANGE_SHOPPING_ITEM_QUANTITY,
  ADD_ITEM,
  SAVE_SHOPPING_LIST_FAILURE,
} from '../constants/ShoppingActionTypes';
import { beginApiCall } from './apiStatusAction';
import { getErrMsg, isAppOffline } from './ErrorUtils';
import { getShoppingList, saveShoppingList } from '../../utils/http/ShoppingClient';
import store from '../configureStore';

function fetchShoppingListSuccess(shoppinglist) {
  return { type: RECEIVED_SHOPPING_LIST_SUCCESS, data: { list: shoppinglist } };
}
function fetchShoppingListFailure(err) {
  return { type: RECEIVED_SHOPPING_LIST_FAILURE, data: { errMsg: getErrMsg(err) } };
}

export function fetchShoppingList(shoppingListId) {
  return (dispatch) => {
    dispatch(beginApiCall());
    getShoppingList(shoppingListId)
      .then((shoppinglist) => {
        dispatch(fetchShoppingListSuccess(shoppinglist));
      })
      .catch((err) => dispatch(fetchShoppingListFailure(err)));
  };
}

function changeItemQuantity(itemId, quantityToAdd) {
  return { type: CHANGE_SHOPPING_ITEM_QUANTITY, data: { itemId, quantityToAdd } };
}

function addItem(item) {
  return { type: ADD_ITEM, data: { item } };
}

function saveShoppingListAction(dispatch) {
  return saveShoppingList(_.cloneDeep(store.getState().shoppingList))
    .then((updatedShoppingList) => dispatch(fetchShoppingListSuccess(updatedShoppingList)))
    .catch((err) => {
      if (isAppOffline(err)) {
        dispatch({
          type: SAVE_SHOPPING_LIST_FAILURE,
          data: { errMsg: "Application hors ligne. La liste n'a pas pu être sauvegardée sur le serveur. " },
        });
      } else {
        dispatch({ type: SAVE_SHOPPING_LIST_FAILURE, data: { errMsg: 'Impossible de sauvegarder la liste de courses.' } });
      }
    });
}

export function changeItemQuantityAndSave(itemId, quantityToAdd) {
  return (dispatch) => {
    dispatch(changeItemQuantity(itemId, quantityToAdd));
    saveShoppingListAction(dispatch);
  };
}

export function addItemAndSave(item) {
  return (dispatch) => {
    dispatch(addItem(item));
    saveShoppingListAction(dispatch);
  };
}
