import {
  RECEIVED_SHOPPING_LIST_SUCCESS,
  RECEIVED_SHOPPING_LIST_FAILURE,
  CHANGE_SHOPPING_ITEM_QUANTITY,
  ADD_ITEM,
} from '../constants/ShoppingActionTypes';
import { beginApiCall } from './apiStatusAction';
import getErrMsg from './ErrorUtils';
import { getShoppingList } from '../../utils/http/ShoppingClient';

export function changeItemQuantity(itemId, quantityToAdd) {
  // TODO: Make saveShoppingListItems
  return { type: CHANGE_SHOPPING_ITEM_QUANTITY, data: { itemId, quantityToAdd } };
}

export function addItem(item) {
  // TODO: Make saveShoppingListItems
  return { type: ADD_ITEM, data: { item } };
}

function fetchShoppingListSuccess(shoppinglist) {
  const normalizedList = {
    ...shoppinglist,
    items: shoppinglist.items.reduce((normItems, item) => {
      return {
        ...normItems,
        [item.id]: item,
      };
    }, {}),
  };
  return { type: RECEIVED_SHOPPING_LIST_SUCCESS, data: { list: normalizedList } };
}
function fetchShoppingListFailure(err) {
  return { type: RECEIVED_SHOPPING_LIST_FAILURE, data: { errMsg: getErrMsg(err) } };
}

// eslint-disable-next-line import/prefer-default-export
export function fetchShoppingList(shoppingListId) {
  return (dispatch) => {
    dispatch(beginApiCall());
    // Ne pas appeler cette fonction ou alors faire en sorte qu'elle throw une erreur si pas de shoppinglist
    getShoppingList(shoppingListId)
      .then((shoppinglist) => {
        dispatch(fetchShoppingListSuccess(shoppinglist));
      })
      .catch((err) => dispatch(fetchShoppingListFailure(err)));
  };
}
