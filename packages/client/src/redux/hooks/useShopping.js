import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { sortByLabel } from '../../utils/ProductsUtils';
import { getFilledShoppingList } from '../../utils/ShoppingListMapper';
import { getUserDefaultShoppingListId } from '../selectors/user.selectors';
import { getGenericProducts, getUserProducts } from '../selectors/products.selectors';
import { getShoppingListItems } from '../selectors/shopping.selectors';
import { getErrorMessage } from '../selectors/error.selectors';
import { fetchProductsList, fetchUserProductsList } from '../actions/products.actions';
import {
  addItemAndSave,
  cancelMoveShopItemToStoreAndSave,
  changeItemCommentAndSave,
  changeItemQuantityAndSave,
  createNewShoppingList,
  fetchShoppingList,
  moveShopItemToStoreAndSave,
} from '../actions/shopping.actions';
import { resetErrorMessage } from '../actions/error.actions';
import { getStoreId } from '../selectors/store.selectors';
import { fetchStore } from '../actions/store.actions';

export function useShopping() {
  const dispatch = useDispatch();

  const [shoppingMode, setShoppingMode] = useState(false);
  const [itemsRemoved, setItemsRemoved] = useState([]);

  const genericProducts = useSelector(getGenericProducts);
  const userProducts = useSelector(getUserProducts);
  const allProducts = genericProducts && userProducts ? [...genericProducts, ...userProducts] : [];

  const userShoppingList = useSelector(getUserDefaultShoppingListId);
  const shoppingItems = useSelector(getShoppingListItems);
  const filledShoppingList = getFilledShoppingList(shoppingItems, allProducts);
  const shelves = Array.from(new Set(filledShoppingList.map((item) => item.product.shelf))).sort();

  const userStore = useSelector(getStoreId);

  const switchShoppingMode = () => {
    if (filledShoppingList && filledShoppingList.length) {
      setItemsRemoved([]);
      setShoppingMode(!shoppingMode);
    }
  };

  const turnShoppingModeOff = () => {
    setItemsRemoved([]);
    setShoppingMode(false);
  };
  /**
   * @deprecated Use moveShopItemToStore
   * @param itemId
   */
  const removeItem = (itemId) => {
    const removedItem = filledShoppingList.find((item) => item.id === itemId);
    dispatch(changeItemQuantityAndSave(itemId, -1));
    const newLastItemRemoved = {
      ...removedItem,
      quantity: 1,
    };
    setItemsRemoved([...itemsRemoved, newLastItemRemoved]);
  };

  const moveShopItemToStore = (itemId) => {
    const removedItem = filledShoppingList.find((item) => item.id === itemId);
    dispatch(moveShopItemToStoreAndSave(itemId, 1));
    const newLastItemRemoved = {
      ...removedItem,
      quantity: 1,
    };
    setItemsRemoved([...itemsRemoved, newLastItemRemoved]);
  };

  const cancelRemoveItem = () => {
    const lastItemRemoved = itemsRemoved[itemsRemoved.length - 1];
    dispatch(cancelMoveShopItemToStoreAndSave(lastItemRemoved, 1));
    const newItemsRemoved = itemsRemoved.slice(0, itemsRemoved.length - 1);
    setItemsRemoved(newItemsRemoved);
  };

  const addItemFromProductArea = (item) => {
    const existingItem = filledShoppingList && filledShoppingList.find((i) => i.product.id === item.product.id);
    if (existingItem) {
      dispatch(changeItemQuantityAndSave(existingItem.id, 1));
    } else {
      dispatch(
        addItemAndSave({
          ...item,
          product: item.product.id,
          quantity: 1,
        })
      );
    }
  };

  // TODO: Déplacer ces useEffect dans l'App pour que ça se lance au démarrage, peu importe sur quelle page on est au départ.

  useEffect(() => {
    if (!genericProducts) {
      dispatch(fetchProductsList());
    }
  }, [dispatch, genericProducts]);

  useEffect(() => {
    if (!Array.isArray(userProducts)) {
      dispatch(fetchUserProductsList());
    }
  }, [dispatch, userProducts]);

  useEffect(() => {
    if (userShoppingList && !filledShoppingList.length) {
      dispatch(fetchShoppingList(userShoppingList));
    }
  }, [dispatch, filledShoppingList.length, userShoppingList]);

  useEffect(() => {
    if (!userStore) {
      dispatch(fetchStore());
    }
  }, [dispatch, userStore]);

  return {
    userShoppingList,
    products: sortByLabel(allProducts),
    shoppingList: filledShoppingList,
    shelves,
    error: useSelector(getErrorMessage),
    resetErrorMsg: () => dispatch(resetErrorMessage()),
    shoppingMode,
    switchShoppingMode,
    turnShoppingModeOff,
    itemsRemoved,
    removeItem,
    cancelRemoveItem,
    addItemFromProductArea,
    moveShopItemToStore,
    changeItemQuantity: (itemId, quantityToAdd) => dispatch(changeItemQuantityAndSave(itemId, quantityToAdd)),
    changeItemComment: (itemId, comment) => dispatch(changeItemCommentAndSave(itemId, comment)),
    createList: () => dispatch(createNewShoppingList()),
  };
}
