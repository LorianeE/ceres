import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, logOut } from '../actions/user.actions';
import { getUserDefaultShoppingListId, getUserIsLoggedIn } from '../selectors/user.selectors';
import { getFetchUserCallInProgress } from '../selectors/apiCallsInProgress.selectors';
import { fetchProductsList } from '../actions/products.actions';
import { fetchShoppingList } from '../actions/shopping.actions';
import { fetchStore } from '../actions/store.actions';
import { getStoreItems } from '../selectors/store.selectors';
import { getGenericProducts } from '../selectors/products.selectors';
import { getShoppingListItems } from '../selectors/shopping.selectors';

export function useInitializeApp() {
  const dispatch = useDispatch();

  const userLoggedIn = useSelector(getUserIsLoggedIn);

  const fetchUserCallInProgress = useSelector(getFetchUserCallInProgress);

  const storeItems = useSelector(getStoreItems);

  const genericProducts = useSelector(getGenericProducts);

  const userShoppingList = useSelector(getUserDefaultShoppingListId);
  const shoppingItems = useSelector(getShoppingListItems);

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  useEffect(() => {
    if (userLoggedIn && !genericProducts) {
      dispatch(fetchProductsList());
    }
  }, [userLoggedIn, dispatch, genericProducts]);

  useEffect(() => {
    if (userLoggedIn && userShoppingList && !shoppingItems) {
      dispatch(fetchShoppingList(userShoppingList));
    }
  }, [userLoggedIn, dispatch, shoppingItems, userShoppingList]);

  useEffect(() => {
    // TODO: Attention en cas d'absence de store: du coup créer un store par défaut ?
    if (userLoggedIn && !storeItems) {
      dispatch(fetchStore());
    }
  }, [userLoggedIn, dispatch, storeItems]);

  return {
    userLoggedIn,
    fetchUserCallInProgress,
    logOut: () => dispatch(logOut()),
  };
}
