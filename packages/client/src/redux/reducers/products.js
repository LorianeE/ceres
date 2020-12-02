import * as types from '../constants/ProductsActionTypes';
import initialState from '../initialState';

function products(state = initialState.products, action) {
  switch (action.type) {
    case types.RECEIVED_DB_LIST_SUCCESS:
      return {
        ...state,
        dbList: action.payload.dbList,
      };
    case types.RECEIVED_DB_LIST_FAILURE:
      return {
        ...state,
        dbList: [],
      };
    case types.RECEIVED_USER_PDT_LIST_SUCCESS:
      return {
        ...state,
        userList: action.payload.userList,
      };
    case types.RECEIVED_USER_PDT_LIST_FAILURE:
      return {
        ...state,
        userList: [],
      };

    default:
      return state;
  }
}

export default products;
