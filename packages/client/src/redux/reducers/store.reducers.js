import * as types from '../constants/StoreActionTypes';
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

function addItem(items, action) {
  const { id } = action.payload.item;
  return {
    ...items,
    [id]: action.payload.item,
  };
}

function storeReducers(state = initialState.store, action) {
  switch (action.type) {
    case types.CHANGE_STORE_ITEM_QUANTITY:
      return {
        ...state,
        items: changeItemQuantity(state.items, action),
      };
    case types.ADD_STORE_ITEM:
      return {
        ...state,
        items: addItem(state.items, action),
      };
    case types.RECEIVED_STORE_SUCCESS:
    case types.CREATE_NEW_STORE:
      return action.payload.store;

    default:
      return state;
  }
}

export default storeReducers;
