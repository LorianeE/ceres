import { nanoid } from 'nanoid';
import {
  CHANGE_STORE_ITEM_QUANTITY,
  RECEIVED_STORE_SUCCESS,
  RECEIVED_STORE_FAILURE,
  UPDATE_STORE_ITEM_FAILURE,
  POST_STORE_ITEM_FAILURE,
  ADD_STORE_ITEM,
  CREATE_NEW_STORE,
} from '../constants/StoreActionTypes';
import { beginApiCall, endApiCall } from './apiStatus.actions';
import { getErrMsg } from '../../utils/ErrorUtils';
import { getStore, postStoreItem, postStore, putStoreItem } from '../../utils/http/StoreClient';

export function createNewStore() {
  return async (dispatch, getState) => {
    const userId = getState().user.id;
    const emptyStore = {
      items: [],
    };
    const store = await postStore(userId, emptyStore);
    dispatch({ type: CREATE_NEW_STORE, payload: { store } });
  };
}

function fetchStoreSuccess(store) {
  return { type: RECEIVED_STORE_SUCCESS, payload: { store } };
}
function fetchStoreFailure(err) {
  return { type: RECEIVED_STORE_FAILURE, payload: { errMsg: getErrMsg(err) } };
}

export function fetchStore(storeId) {
  return async (dispatch, getState) => {
    const userId = getState().user.id;
    dispatch(beginApiCall());

    try {
      const store = await getStore(userId, storeId);
      dispatch(fetchStoreSuccess(store));
    } catch (err) {
      dispatch(fetchStoreFailure(err));
    }
  };
}

export function postNewStoreItem(item) {
  return async (dispatch, getState) => {
    const userId = getState().user.id;
    const storeId = getState().store.id;
    dispatch(beginApiCall());
    try {
      await postStoreItem(userId, storeId, item);
      dispatch(endApiCall());
      // Update shopping list in store
      dispatch(fetchStore(storeId));
    } catch (err) {
      dispatch({ type: POST_STORE_ITEM_FAILURE, payload: { errMsg: getErrMsg(err) } });
    }
  };
}

export function updateStoreItem(item, quantityToAdd) {
  return async (dispatch, getState) => {
    const userId = getState().user.id;
    const storeId = getState().store.id;
    const updatedItem = {
      ...item,
      quantity: item.quantity + quantityToAdd,
    };
    dispatch(beginApiCall());
    try {
      await putStoreItem(userId, storeId, updatedItem);
      dispatch(endApiCall());
      // Update shopping list in store
      dispatch(fetchStore(storeId));
    } catch (err) {
      if (err.response.data.message === 'INVALID_ITEM_ID') {
        dispatch(endApiCall());
        dispatch(postNewStoreItem(updatedItem));
      } else {
        dispatch({ type: UPDATE_STORE_ITEM_FAILURE, payload: { errMsg: getErrMsg(err) } });
      }
    }
  };
}

export function changeStoreItemQuantityAndSave(itemId, quantityToAdd) {
  return (dispatch, getState) => {
    const item = getState().store.items[itemId];
    dispatch({ type: CHANGE_STORE_ITEM_QUANTITY, payload: { itemId, quantityToAdd } });
    dispatch(updateStoreItem(item, quantityToAdd));
  };
}

export function addStoreItemAndSave(item) {
  return (dispatch) => {
    dispatch({ type: ADD_STORE_ITEM, payload: { item: { id: nanoid(), ...item } } });
    dispatch(postNewStoreItem(item));
  };
}
