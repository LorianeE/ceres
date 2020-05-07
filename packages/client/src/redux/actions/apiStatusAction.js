import { BEGIN_API_CALL, BEGIN_FETCH_USER, END_FETCH_USER } from '../constants/CommonActionTypes';

export function beginApiCall() {
  return { type: BEGIN_API_CALL };
}

export function beginFetchUser() {
  return { type: BEGIN_FETCH_USER };
}

export function endFetchUser() {
  return { type: END_FETCH_USER };
}
