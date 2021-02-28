import { applyMiddleware, createStore, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

const logger = createLogger({
  collapsed: true,
});

const store = createStore(
  rootReducer,
  // eslint-disable-next-line no-underscore-dangle
  compose(applyMiddleware(thunk, logger), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
  // eslint-enable
);

export default store;
