import { combineReducers } from 'redux';

import shoppingList from './shoppingList';
import products from './products';
import error from './error';
import apiCallsInProgress from './apiStatusReducer';
import user from './user';

const rootReducer = combineReducers({
  user,
  shoppingList,
  products,
  error,
  apiCallsInProgress,
});

export default rootReducer;
