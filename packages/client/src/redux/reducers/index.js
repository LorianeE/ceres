import { combineReducers } from 'redux';

import shoppingListReducers from './shoppingList.reducers';
import storeReducers from './store.reducers';
import productsReducers from './products.reducers';
import errorReducers from './error.reducers';
import apiCallsInProgress from './apiStatus.reducers';
import userReducers from './user.reducers';
import recipesReducers from './recipes.reducers';

const rootReducer = combineReducers({
  user: userReducers,
  shoppingList: shoppingListReducers,
  store: storeReducers,
  products: productsReducers,
  recipesInfo: recipesReducers,
  error: errorReducers,
  apiCallsInProgress,
});

export default rootReducer;
