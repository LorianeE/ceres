import * as types from '../constants/ShoppingActionTypes';
import initialState from '../initialState';

function changeItemQuantity(items, action) {
  const { itemId, quantityToAdd } = action.data;
  const item = items[itemId];
  const newQuantity = item.quantity + quantityToAdd;
  if (newQuantity <= 0) {
    item.quantity = newQuantity;
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
      quantity: item.quantity + quantityToAdd,
    },
  };
}

function changeItemComment(items, action) {
  const { itemId, comment } = action.data;
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
  const { quantity, product, comment } = action.data.item;
  let { id } = action.data.item;
  if (!id) {
    id = Date.now();
  }
  return {
    ...items,
    [id]: {
      id: id.toString(),
      quantity,
      product: product.id,
      comment,
    },
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
      return action.data.list;

    default:
      return state;
  }
}

export default shoppingList;
