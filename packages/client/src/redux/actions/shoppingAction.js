import * as types from '../constants/ShoppingActionTypes';

export const addItem = (item) => ({
  type: types.ADD_ITEM,
  item,
});

export const removeItem = (item) => ({
  type: types.REMOVE_ITEM,
  item,
});
