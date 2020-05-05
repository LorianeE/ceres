import * as types from '../constants/ProductsActionTypes';

const defaultState = {
  dbList: [],
  userList: [],
};

function products(state = defaultState, action) {
  switch (action.type) {
    case types.RECEIVED_DB_LIST_SUCCESS:
      return {
        ...state,
        dbList: action.data.dbList,
      };
    case types.RECEIVED_DB_LIST_FAILURE:
      return {
        ...state,
        dbList: action.data.dbList,
      };

    default:
      return state;
  }
}

export default products;
