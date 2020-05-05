import * as types from '../constants/ShoppingActionTypes';
import initialState from '../initialState';

// A refactorer pour faire une composition de reducers et avoir ici direct les items
function changeItemQuantity(state, action) {
  const { itemId, quantityToAdd } = action.data;
  const item = state.items[itemId];
  const newQuantity = item.quantity + quantityToAdd;
  if (newQuantity <= 0) {
    item.quantity = newQuantity;
    const newState = {
      ...state,
    };
    delete newState.items[itemId];
    return newState;
  }
  return {
    ...state,
    items: {
      ...state.items,
      [itemId]: {
        ...item,
        quantity: item.quantity + quantityToAdd,
      },
    },
  };
}

function addItem(state, action) {
  const { item } = action.data;
  const { quantity, product } = item;
  let { id } = item;
  if (!id) {
    id = Date.now();
  }
  return {
    ...state,
    items: {
      ...state.items,
      [id]: {
        id,
        quantity,
        product: product.id,
      },
    },
  };
}

function shoppingList(state = initialState.shoppingList, action) {
  switch (action.type) {
    case types.CHANGE_SHOPPING_ITEM_QUANTITY:
      return changeItemQuantity(state, action);
    case types.ADD_ITEM:
      return addItem(state, action);
    case types.RECEIVED_SHOPPING_LIST_SUCCESS:
      return action.data.list;

    default:
      return state;
  }
}

export default shoppingList;
