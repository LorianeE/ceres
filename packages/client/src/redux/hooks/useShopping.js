import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { getFilledShoppingList } from '../../utils/ShoppingListMapper';
import { getUserDefaultShoppingListId } from '../selectors/user.selectors';
import { getShoppingListItems } from '../selectors/shopping.selectors';
import { getErrorMessage } from '../selectors/error.selectors';
import {
  addItemAndSave,
  cancelMoveShopItemToStoreAndSave,
  changeItemCommentAndSave,
  changeItemQuantityAndSave,
  createNewShoppingList,
  moveShopItemToStoreAndSave,
} from '../actions/shopping.actions';
import { resetErrorMessage } from '../actions/error.actions';
import { useProducts } from './useProducts';

export function useShopping() {
  const dispatch = useDispatch();

  const [shoppingMode, setShoppingMode] = useState(false);
  const [itemsRemoved, setItemsRemoved] = useState([]);

  const { allProducts, productsSortedByLabel } = useProducts();

  const userShoppingList = useSelector(getUserDefaultShoppingListId);
  const shoppingItems = useSelector(getShoppingListItems);
  const filledShoppingList = getFilledShoppingList(shoppingItems, allProducts);
  const shelves = Array.from(new Set(filledShoppingList.map((item) => item.product.shelf))).sort();

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

  return {
    userShoppingList,
    products: productsSortedByLabel,
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
