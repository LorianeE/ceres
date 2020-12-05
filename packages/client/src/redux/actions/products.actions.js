import {
  RECEIVED_DB_LIST_FAILURE,
  RECEIVED_DB_LIST_SUCCESS,
  RECEIVED_USER_PDT_LIST_SUCCESS,
  RECEIVED_USER_PDT_LIST_FAILURE,
  REMOVE_USER_PRODUCTS,
  DELETE_USER_PRODUCT_FAILURE,
  UPDATE_USER_PRODUCT,
  UPDATE_USER_PRODUCT_FAILURE,
  ADD_USER_PRODUCT,
  ADD_USER_PRODUCT_FAILURE,
} from '../constants/ProductsActionTypes';
import {
  addUserProduct,
  deleteUserProduct,
  getProductsList,
  getUserProductsList,
  updateUserProduct,
} from '../../utils/http/ProductsClient';
import { beginApiCall, endApiCall } from './apiStatus.actions';
import { getErrMsg } from '../../utils/ErrorUtils';

function fetchDBProductsListSuccess(products) {
  return { type: RECEIVED_DB_LIST_SUCCESS, payload: { dbList: products } };
}

function fetchDBProductsListFailure(err) {
  return { type: RECEIVED_DB_LIST_FAILURE, payload: { errMsg: getErrMsg(err) } };
}

function fetchUserProductsListSuccess(products) {
  return { type: RECEIVED_USER_PDT_LIST_SUCCESS, payload: { userList: products } };
}

function fetchUserProductsListFailure(err) {
  return { type: RECEIVED_USER_PDT_LIST_FAILURE, payload: { errMsg: getErrMsg(err) } };
}

function updateUserProductFailure(err) {
  return { type: UPDATE_USER_PRODUCT_FAILURE, payload: { errMsg: getErrMsg(err) } };
}

function addUserProductFailure(err) {
  return { type: ADD_USER_PRODUCT_FAILURE, payload: { errMsg: getErrMsg(err) } };
}

function deleteUserProductFailure(err, productId) {
  return {
    type: DELETE_USER_PRODUCT_FAILURE,
    payload: { errMsg: `Error in deleting product ${productId} : ${getErrMsg(err)}` },
  };
}

function fetchDBProductsList() {
  return (dispatch) => {
    dispatch(beginApiCall());
    getProductsList()
      .then((products) => dispatch(fetchDBProductsListSuccess(products)))
      .catch((err) => dispatch(fetchDBProductsListFailure(err)));
  };
}

export function fetchUserProductsList() {
  return (dispatch, getState) => {
    dispatch(beginApiCall());
    const userId = getState().user.id;
    getUserProductsList(userId)
      .then((products) => dispatch(fetchUserProductsListSuccess(products)))
      .catch((err) => dispatch(fetchUserProductsListFailure(err)));
  };
}

export function fetchProductsList() {
  return (dispatch) => Promise.all([dispatch(fetchDBProductsList()), dispatch(fetchUserProductsList())]);
}

function deleteProductsInDatabase(productIds) {
  return async (dispatch, getState) => {
    dispatch(beginApiCall());
    const userId = getState().user.id;
    await Promise.all(
      productIds.map(async (productId) => {
        try {
          await deleteUserProduct(userId, productId);
          dispatch(endApiCall());
        } catch (err) {
          dispatch(deleteUserProductFailure(err, productId));
        }
      })
    );
    dispatch(fetchUserProductsList());
  };
}

export function deleteProducts(productIds) {
  return (dispatch) => {
    dispatch({ type: REMOVE_USER_PRODUCTS, payload: { productIds } });
    dispatch(deleteProductsInDatabase(productIds));
  };
}

function updateProductInDatabase(product) {
  return async (dispatch, getState) => {
    dispatch(beginApiCall());
    const userId = getState().user.id;
    try {
      await updateUserProduct(userId, product);
      dispatch(endApiCall());
      dispatch(fetchUserProductsList());
    } catch (err) {
      dispatch(updateUserProductFailure(err));
    }
  };
}

export function updateProduct(product) {
  return (dispatch) => {
    dispatch({ type: UPDATE_USER_PRODUCT, payload: { product } });
    dispatch(updateProductInDatabase(product));
  };
}

function addProductInDatabase(product) {
  return async (dispatch, getState) => {
    dispatch(beginApiCall());
    const userId = getState().user.id;
    try {
      await addUserProduct(userId, product);
      dispatch(endApiCall());
      dispatch(fetchUserProductsList());
    } catch (err) {
      dispatch(addUserProductFailure(err));
    }
  };
}

export function addProduct(product) {
  return (dispatch) => {
    dispatch({ type: ADD_USER_PRODUCT, payload: { product } });
    dispatch(addProductInDatabase(product));
  };
}
