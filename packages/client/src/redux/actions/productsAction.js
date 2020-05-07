import { RECEIVED_DB_LIST_FAILURE, RECEIVED_DB_LIST_SUCCESS } from '../constants/ProductsActionTypes';
import getProductsList from '../../utils/http/ItemsClient';
import { beginApiCall } from './apiStatusAction';
import { getErrMsg } from './ErrorUtils';

export function fetchDBProductsListSuccess(products) {
  return { type: RECEIVED_DB_LIST_SUCCESS, data: { dbList: products } };
}

export function fetchDBProductsListFailure(err) {
  return { type: RECEIVED_DB_LIST_FAILURE, data: { errMsg: getErrMsg(err) } };
}

// eslint-disable-next-line import/prefer-default-export
export function fetchDBProductsList() {
  return (dispatch) => {
    dispatch(beginApiCall());
    getProductsList()
      .then((products) => dispatch(fetchDBProductsListSuccess(products)))
      .catch((err) => dispatch(fetchDBProductsListFailure(err)));
  };
}
