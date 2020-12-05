import * as types from '../constants/ProductsActionTypes';
import initialState from '../initialState';

function removeUserProducts(productIds, userProducts) {
  return userProducts.filter((product) => !productIds.includes(product.id));
}

function updateUserProduct(product, userProducts) {
  return userProducts.map((p) => {
    if (p.id === product.id) {
      return product;
    }
    return p;
  });
}

function productsReducers(state = initialState.products, action) {
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
    case types.REMOVE_USER_PRODUCTS:
      return {
        ...state,
        userList: removeUserProducts(action.payload.productIds, state.userList),
      };
    case types.UPDATE_USER_PRODUCT:
      return {
        ...state,
        userList: updateUserProduct(action.payload.product, state.userList),
      };

    default:
      return state;
  }
}

export default productsReducers;
