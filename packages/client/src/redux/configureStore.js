import { applyMiddleware, createStore, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

const logger = createLogger({
  collapsed: true,
});

const enhancers = [];
const middleware = [thunk, logger];

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-underscore-dangle
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

export default function configureStore(preloadedState) {
  return createStore(rootReducer, preloadedState, compose(applyMiddleware(...middleware), ...enhancers));
}
