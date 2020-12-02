import { combineReducers } from 'redux';

import shoppingListReducers from './shoppingList.reducers';
import productsReducers from './products.reducers';
import errorReducers from './error.reducers';
import apiCallsInProgress from './apiStatus.reducers';
import userReducers from './user.reducers';

const rootReducer = combineReducers({
  user: userReducers,
  shoppingList: shoppingListReducers,
  products: productsReducers,
  error: errorReducers,
  apiCallsInProgress,
});

export default rootReducer;
