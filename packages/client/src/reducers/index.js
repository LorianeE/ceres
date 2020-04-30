import { combineReducers } from 'redux';

import shoppingList from './shoppingList';
import products from './products';
import error from './error';

const rootReducer = combineReducers({
  shoppingList,
  products,
  error,
});

export default rootReducer;
