import { BEGIN_API_CALL, END_API_CALL } from '../constants/CommonActionTypes';

export function beginApiCall() {
  return { type: BEGIN_API_CALL };
}

export function endApiCall() {
  return { type: END_API_CALL };
}

export default {
  beginApiCall,
};
