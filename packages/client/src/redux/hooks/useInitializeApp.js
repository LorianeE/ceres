import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, logOut } from '../actions/user.actions';
import { getUserIsLoggedIn } from '../selectors/user.selectors';
import { getFetchUserCallInProgress } from '../selectors/apiCallsInProgress.selectors';

export function useInitializeApp() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  const userLoggedIn = useSelector(getUserIsLoggedIn);
  const fetchUserCallInProgress = useSelector(getFetchUserCallInProgress);

  return {
    userLoggedIn,
    fetchUserCallInProgress,
    logOut: () => dispatch(logOut()),
  };
}
