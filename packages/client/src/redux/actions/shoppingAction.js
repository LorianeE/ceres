import {
  RECEIVED_SHOPPING_LIST_SUCCESS,
  RECEIVED_SHOPPING_LIST_FAILURE,
  CHANGE_SHOPPING_ITEM_QUANTITY,
  ADD_ITEM,
} from '../constants/ShoppingActionTypes';
import { beginApiCall } from './apiStatusAction';
import getErrMsg from './ErrorUtils';
import { getShoppingList, saveShoppingList } from '../../utils/http/ShoppingClient';
import store from '../configureStore';

export function changeItemQuantity(itemId, quantityToAdd) {
  return { type: CHANGE_SHOPPING_ITEM_QUANTITY, data: { itemId, quantityToAdd } };
}

export function addItem(item) {
  return { type: ADD_ITEM, data: { item } };
}

export function changeItemQuantityAndSave(itemId, quantityToAdd) {
  return (dispatch) => {
    dispatch(changeItemQuantity(itemId, quantityToAdd));
    saveShoppingList(store.getState().shoppingList);
  };
}

export function addItemAndSave(item) {
  return (dispatch) => {
    dispatch(addItem(item));
    saveShoppingList(store.getState().shoppingList);
  };
}

function fetchShoppingListSuccess(shoppinglist) {
  const normalizedList = {
    ...shoppinglist,
    items: shoppinglist.items.reduce((normItems, item) => {
      return {
        ...normItems,
        [item.id]: item,
      };
    }, {}),
  };
  return { type: RECEIVED_SHOPPING_LIST_SUCCESS, data: { list: normalizedList } };
}
function fetchShoppingListFailure(err) {
  return { type: RECEIVED_SHOPPING_LIST_FAILURE, data: { errMsg: getErrMsg(err) } };
}

// eslint-disable-next-line import/prefer-default-export
export function fetchShoppingList(shoppingListId) {
  return (dispatch) => {
    dispatch(beginApiCall());
    // Ne pas appeler cette fonction ou alors faire en sorte qu'elle throw une erreur si pas de shoppinglist
    getShoppingList(shoppingListId)
      .then((shoppinglist) => {
        dispatch(fetchShoppingListSuccess(shoppinglist));
      })
      .catch((err) => dispatch(fetchShoppingListFailure(err)));
  };
}
