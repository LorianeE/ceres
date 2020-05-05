import { combineReducers } from 'redux';

import shoppingList from './shoppingList';
import products from './products';
import error from './error';
import apiCallsInProgress from './apiStatusReducer';

const rootReducer = combineReducers({
  shoppingList,
  products,
  error,
  apiCallsInProgress,
});

export default rootReducer;
