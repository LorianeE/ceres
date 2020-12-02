import * as types from '../constants/ShoppingActionTypes';
import initialState from '../initialState';

function changeItemQuantity(items, action) {
  const { itemId, quantityToAdd } = action.payload;
  const item = items[itemId];
  const newQuantity = item.quantity + quantityToAdd;
  if (newQuantity <= 0) {
    const newStateItems = {
      ...items,
    };
    delete newStateItems[itemId];
    return newStateItems;
  }
  return {
    ...items,
    [itemId]: {
      ...item,
      quantity: newQuantity,
    },
  };
}

function changeItemComment(items, action) {
  const { itemId, comment } = action.payload;
  const item = items[itemId];
  return {
    ...items,
    [itemId]: {
      ...item,
      comment,
    },
  };
}

function addItem(items, action) {
  const { id } = action.payload.item;
  return {
    ...items,
    [id]: action.payload.item,
  };
}

function shoppingList(state = initialState.shoppingList, action) {
  switch (action.type) {
    case types.CHANGE_SHOPPING_ITEM_QUANTITY:
      return {
        ...state,
        items: changeItemQuantity(state.items, action),
      };
    case types.CHANGE_SHOPPING_ITEM_COMMENT:
      return {
        ...state,
        items: changeItemComment(state.items, action),
      };
    case types.ADD_ITEM:
      return {
        ...state,
        items: addItem(state.items, action),
      };
    case types.RECEIVED_SHOPPING_LIST_SUCCESS:
    case types.CREATE_NEW_SHOPPING_LIST:
      return action.payload.list;

    default:
      return state;
  }
}

export default shoppingList;
