import * as types from '../constants/CommonActionTypes';
import initialState from '../initialState';
import { END_API_CALL } from '../constants/CommonActionTypes';

function actionTypeEndsInSuccess(type) {
  return type.substring(type.length - 8) === '_SUCCESS';
}
function actionTypeEndsInFailure(type) {
  return type.substring(type.length - 8) === '_FAILURE';
}

function apiCallStatusReducer(state = initialState.apiCallsInProgress, action) {
  if (action.type === types.BEGIN_API_CALL) {
    return {
      ...state,
      apiCalls: state.apiCalls + 1,
    };
  }
  if (actionTypeEndsInSuccess(action.type) || actionTypeEndsInFailure(action.type) || action.type === END_API_CALL) {
    return {
      ...state,
      apiCalls: state.apiCalls - 1,
    };
  }
  if (action.type === types.BEGIN_FETCH_USER) {
    return {
      ...state,
      fetchUserCallInProgress: true,
    };
  }
  if (action.type === types.END_FETCH_USER) {
    return {
      ...state,
      fetchUserCallInProgress: false,
    };
  }
  return state;
}

export default apiCallStatusReducer;
