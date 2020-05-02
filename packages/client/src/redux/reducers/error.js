import * as types from '../constants/ProductsActionTypes';
import initialState from '../initialState';

function error(state = initialState.error, action) {
  switch (action.type) {
    case types.RECEIVED_DB_LIST_ERROR:
      return {
        ...state,
        errorMsg: action.data.errMsg,
      };
    case types.RECEIVED_DB_LIST_SUCCESS:
      return {
        ...state,
        errorMsg: '',
      };
    default:
      return state;
  }
}

export default error;
