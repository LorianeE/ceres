import {
  RECEIVED_DB_LIST_FAILURE,
  RECEIVED_DB_LIST_SUCCESS,
  RECEIVED_USER_PDT_LIST_SUCCESS,
  RECEIVED_USER_PDT_LIST_FAILURE,
} from '../constants/ProductsActionTypes';
import { getProductsList, getUserProductsList } from '../../utils/http/ProductsClient';
import { beginApiCall } from './apiStatusAction';
import { getErrMsg } from './ErrorUtils';

function fetchDBProductsListSuccess(products) {
  return { type: RECEIVED_DB_LIST_SUCCESS, data: { dbList: products } };
}

function fetchDBProductsListFailure(err) {
  return { type: RECEIVED_DB_LIST_FAILURE, data: { errMsg: getErrMsg(err) } };
}

function fetchUserProductsListSuccess(products) {
  return { type: RECEIVED_USER_PDT_LIST_SUCCESS, data: { userList: products } };
}

function fetchUserProductsListFailure(err) {
  return { type: RECEIVED_USER_PDT_LIST_FAILURE, data: { errMsg: getErrMsg(err) } };
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
    // eslint-disable-next-line no-underscore-dangle
    const userId = getState().user._id;
    getUserProductsList(userId)
      .then((products) => dispatch(fetchUserProductsListSuccess(products)))
      .catch((err) => dispatch(fetchUserProductsListFailure(err)));
  };
}

export function fetchProductsList() {
  return (dispatch) => Promise.all([dispatch(fetchDBProductsList()), dispatch(fetchUserProductsList())]);
}
