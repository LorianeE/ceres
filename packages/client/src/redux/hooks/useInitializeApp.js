import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, logOut } from '../actions/user.actions';
import { getUserDefaultShoppingListId, getUserIsLoggedIn } from '../selectors/user.selectors';
import { getFetchUserCallInProgress } from '../selectors/apiCallsInProgress.selectors';
import { fetchProductsList } from '../actions/products.actions';
import { fetchShoppingList } from '../actions/shopping.actions';
import { fetchStore } from '../actions/store.actions';

export function useInitializeApp() {
  const dispatch = useDispatch();

  const userLoggedIn = useSelector(getUserIsLoggedIn);

  const fetchUserCallInProgress = useSelector(getFetchUserCallInProgress);

  const userShoppingList = useSelector(getUserDefaultShoppingListId);

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  useEffect(() => {
    if (userLoggedIn) {
      dispatch(fetchProductsList());
      dispatch(fetchStore());
    }
  }, [userLoggedIn, dispatch]);

  useEffect(() => {
    if (userLoggedIn) {
      dispatch(fetchShoppingList(userShoppingList));
    }
  }, [userLoggedIn, dispatch, userShoppingList]);

  return {
    userLoggedIn,
    fetchUserCallInProgress,
    logOut: () => dispatch(logOut()),
  };
}
