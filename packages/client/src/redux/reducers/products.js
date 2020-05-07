import * as types from '../constants/ProductsActionTypes';
import initialState from '../initialState';

function products(state = initialState.products, action) {
  switch (action.type) {
    case types.RECEIVED_DB_LIST_SUCCESS:
      return {
        ...state,
        dbList: action.data.dbList,
      };
    case types.RECEIVED_DB_LIST_FAILURE:
      return {
        ...state,
        dbList: [],
      };

    default:
      return state;
  }
}

export default products;
