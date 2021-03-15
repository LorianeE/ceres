import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, logOut } from '../actions/user.actions';
import { getUserDefaultShoppingListId, getUserIsLoggedIn, getUserStoreId } from '../selectors/user.selectors';
import { getFetchUserCallInProgress } from '../selectors/apiCallsInProgress.selectors';
import { fetchProductsList } from '../actions/products.actions';
import { fetchShoppingList } from '../actions/shopping.actions';
import { createNewStore, fetchStore } from '../actions/store.actions';

export function useInitializeApp() {
  const dispatch = useDispatch();

  const userLoggedIn = useSelector(getUserIsLoggedIn);
  const userStoreId = useSelector(getUserStoreId);

  const fetchUserCallInProgress = useSelector(getFetchUserCallInProgress);

  const userShoppingList = useSelector(getUserDefaultShoppingListId);

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  useEffect(() => {
    if (userLoggedIn) {
      dispatch(fetchProductsList());
    }
  }, [userLoggedIn, dispatch]);

  useEffect(() => {
    if (userLoggedIn) {
      if (userStoreId) {
        dispatch(fetchStore(userStoreId));
      } else {
        dispatch(createNewStore());
      }
    }
  }, [userLoggedIn, dispatch, userStoreId]);

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
