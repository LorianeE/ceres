import * as productstypes from '../constants/ProductsActionTypes';
import * as shoppingTypes from '../constants/ShoppingActionTypes';
import initialState from '../initialState';
import { RESET_ERROR_MSG } from '../constants/CommonActionTypes';

function errorReducers(state = initialState.error, action) {
  switch (action.type) {
    case shoppingTypes.UPDATE_ITEM_FAILURE:
    case shoppingTypes.POST_ITEM_FAILURE:
    case productstypes.RECEIVED_DB_LIST_FAILURE:
    case shoppingTypes.RECEIVED_SHOPPING_LIST_FAILURE:
      return {
        ...state,
        errorMsg: action.payload.errMsg,
      };
    case shoppingTypes.RECEIVED_SHOPPING_LIST_SUCCESS:
    case productstypes.RECEIVED_DB_LIST_SUCCESS:
    case RESET_ERROR_MSG:
      return {
        ...state,
        errorMsg: '',
      };
    default:
      return state;
  }
}

export default errorReducers;
