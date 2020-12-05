import { UPDATE_USER, LOGOUT_USER } from '../constants/UserActionTypes';
import LoginUtils from '../../utils/http/LoginClient';
import { beginFetchUser, endFetchUser } from './apiStatus.actions';

export function getUserInfo() {
  return async (dispatch) => {
    dispatch(beginFetchUser());
    try {
      const userInfo = await LoginUtils.getUserInfo();
      dispatch(endFetchUser());
      if (userInfo) {
        dispatch({ type: UPDATE_USER, payload: { user: userInfo } });
      } else {
        dispatch({ type: LOGOUT_USER });
      }
    } catch (err) {
      dispatch(endFetchUser());
      dispatch({ type: LOGOUT_USER });
    }
  };
}

export function logOut() {
  return async (dispatch) => {
    await LoginUtils.logout();
    dispatch({ type: LOGOUT_USER });
  };
}
