import * as types from '../constants/ProductsActionTypes';
import getProductsList from '../utils/http/ItemsClient';

function getErrMsg(err) {
  // The request was made and the server responded with a status code
  // that falls out of the range of 2xx
  if (err.response) {
    return "Une erreur est survenue lors de l'appel au serveur. Veuillez réactualiser la page.";
  }
  if (err && err.request && err.request.status === 0) {
    return "Oh non ! L'application semble être hors ligne...";
  }
  return 'Une erreur est survenue. Veuillez réactualiser la page.';
}

// eslint-disable-next-line import/prefer-default-export
export function fetchDBProductsList() {
  return (dispatch) => {
    dispatch({ type: types.REQUEST_DB_LIST, data: {} });
    getProductsList()
      .then((products) => dispatch({ type: types.RECEIVED_DB_LIST_SUCCESS, data: { dbList: products } }))
      .catch((err) => dispatch({ type: types.RECEIVED_DB_LIST_ERROR, data: { dbList: [], errMsg: getErrMsg(err) } }));
  };
}
