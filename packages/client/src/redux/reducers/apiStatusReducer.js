import * as types from '../constants/CommonActionTypes';
import initialState from '../initialState';

function actionTypeEndsInSuccess(type) {
  return type.substring(type.length - 8) === '_SUCCESS';
}
function actionTypeEndsInFailure(type) {
  return type.substring(type.length - 8) === '_FAILURE';
}

function apiCallStatusReducer(state = initialState.apiCallsInProgress, action) {
  if (action.type === types.BEGIN_API_CALL) {
    return state + 1;
  }
  if (action.type === types.END_API_CALL) {
    return state - 1;
  }
  if (actionTypeEndsInSuccess(action.type) || actionTypeEndsInFailure(action.type)) {
    return state - 1;
  }
  return state;
}

export default apiCallStatusReducer;
