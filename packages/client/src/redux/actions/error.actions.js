import { RESET_ERROR_MSG } from '../constants/CommonActionTypes';

export function resetErrorMessage() {
  return { type: RESET_ERROR_MSG };
}

export default {
  resetErrorMessage,
};
