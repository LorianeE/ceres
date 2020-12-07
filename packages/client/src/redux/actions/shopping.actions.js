import { nanoid } from 'nanoid';
import {
  RECEIVED_SHOPPING_LIST_SUCCESS,
  RECEIVED_SHOPPING_LIST_FAILURE,
  CHANGE_SHOPPING_ITEM_QUANTITY,
  CHANGE_SHOPPING_ITEM_COMMENT,
  ADD_ITEM,
  UPDATE_ITEM_FAILURE,
  POST_ITEM_FAILURE,
  MOVE_ITEM_FAILURE,
} from '../constants/ShoppingActionTypes';
import { beginApiCall, endApiCall } from './apiStatus.actions';
import { getErrMsg } from '../../utils/ErrorUtils';
import { getShoppingList, postItem, postShopItemToStore, postShoppingList, putItem } from '../../utils/http/ShoppingClient';
import { CREATE_NEW_SHOPPING_LIST } from '../constants/UserActionTypes';
import { fetchStore } from './store.actions';
import { CHANGE_STORE_ITEM_QUANTITY } from '../constants/StoreActionTypes';

function fetchShoppingListSuccess(shoppinglist) {
  return { type: RECEIVED_SHOPPING_LIST_SUCCESS, payload: { list: shoppinglist } };
}
function fetchShoppingListFailure(err) {
  return { type: RECEIVED_SHOPPING_LIST_FAILURE, payload: { errMsg: getErrMsg(err) } };
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
  return { type: CHANGE_SHOPPING_ITEM_QUANTITY, payload: { itemId, quantityToAdd } };
}
function changeItemComment(itemId, comment) {
  return { type: CHANGE_SHOPPING_ITEM_COMMENT, payload: { itemId, comment } };
}
function addItem(item) {
  return { type: ADD_ITEM, payload: { item: { id: nanoid(), ...item } } };
}

export function postNewItem(item) {
  return async (dispatch, getState) => {
    const userId = getState().user.id;
    const shoppingListId = getState().shoppingList.id;
    dispatch(beginApiCall());
    try {
      await postItem(userId, shoppingListId, item);
      dispatch(endApiCall());
      // Update shopping list in store
      dispatch(fetchShoppingList(shoppingListId));
    } catch (err) {
      dispatch({ type: POST_ITEM_FAILURE, payload: { errMsg: getErrMsg(err) } });
    }
  };
}

export function updateItem(item, { quantityToAdd = 0, comment }) {
  return async (dispatch, getState) => {
    const userId = getState().user.id;
    const shoppingListId = getState().shoppingList.id;
    const updatedItem = {
      ...item,
      comment: comment !== undefined ? comment : item.comment,
      quantity: item.quantity + quantityToAdd,
    };
    dispatch(beginApiCall());
    try {
      await putItem(userId, shoppingListId, updatedItem);
      dispatch(endApiCall());
      // Update shopping list in store
      dispatch(fetchShoppingList(shoppingListId));
    } catch (err) {
      if (err.response.data.message === 'INVALID_ITEM_ID') {
        dispatch(endApiCall());
        dispatch(postNewItem(updatedItem));
      } else {
        dispatch({ type: UPDATE_ITEM_FAILURE, payload: { errMsg: getErrMsg(err) } });
      }
    }
  };
}

export function changeItemQuantityAndSave(itemId, quantityToAdd) {
  return (dispatch, getState) => {
    const item = getState().shoppingList.items[itemId];
    dispatch(changeItemQuantity(itemId, quantityToAdd));
    dispatch(updateItem(item, { quantityToAdd }));
  };
}

export function changeItemCommentAndSave(itemId, comment) {
  return (dispatch, getState) => {
    const item = getState().shoppingList.items[itemId];
    dispatch(changeItemComment(itemId, comment));
    dispatch(updateItem(item, { comment }));
  };
}

export function addItemAndSave(item) {
  return (dispatch) => {
    dispatch(addItem(item));
    dispatch(postNewItem(item));
  };
}

export function createNewShoppingList() {
  return async (dispatch, getState) => {
    const userId = getState().user.id;
    const emptyShoppingList = {
      items: [],
    };
    const shoppingList = await postShoppingList(userId, emptyShoppingList);
    dispatch({ type: CREATE_NEW_SHOPPING_LIST, payload: { list: shoppingList } });
  };
}

export function moveShopItemToStore(itemId, quantityToMove) {
  return async (dispatch, getState) => {
    const userId = getState().user.id;
    const shoppingListId = getState().shoppingList.id;
    const storeId = getState().store.id;
    dispatch(beginApiCall());
    try {
      await postShopItemToStore(userId, shoppingListId, itemId, quantityToMove);
      dispatch(endApiCall());
      // Update shopping list in store
      dispatch(fetchShoppingList(shoppingListId));
      // Update store
      dispatch(fetchStore(storeId));
    } catch (err) {
      dispatch({ type: MOVE_ITEM_FAILURE, payload: { errMsg: getErrMsg(err) } });
    }
  };
}

export function moveShopItemToStoreAndSave(itemId, quantityToMove) {
  return (dispatch) => {
    dispatch(changeItemQuantity(itemId, -quantityToMove));
    dispatch({ type: CHANGE_STORE_ITEM_QUANTITY, payload: { itemId, quantityToMove } });
    dispatch(moveShopItemToStore(itemId, quantityToMove));
  };
}
