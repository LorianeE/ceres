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
  changeItemCommentAndSave,
  changeItemQuantityAndSave,
  createNewShoppingList,
  fetchShoppingList,
} from '../actions/shopping.actions';
import { resetErrorMessage } from '../actions/error.actions';

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

  const switchShoppingMode = () => {
    if (shoppingMode) {
      setItemsRemoved([]);
    }
    setShoppingMode(!shoppingMode);
  };

  const removeItem = (itemId) => {
    const removedItem = filledShoppingList.find((item) => item.id === itemId);
    dispatch(changeItemQuantityAndSave(itemId, -1));
    const newLastItemRemoved = {
      ...removedItem,
      quantity: 1,
    };
    setItemsRemoved([...itemsRemoved, newLastItemRemoved]);
  };

  const cancelRemoveItem = () => {
    const lastItemRemoved = itemsRemoved[itemsRemoved.length - 1];
    const itemInList = filledShoppingList.find((item) => item.id === lastItemRemoved.id);
    if (itemInList) {
      dispatch(changeItemQuantityAndSave(itemInList.id, lastItemRemoved.quantity));
    } else {
      dispatch(
        addItemAndSave({
          ...lastItemRemoved,
          product: lastItemRemoved.product.id,
        })
      );
    }
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

  useEffect(() => {
    if (!genericProducts.length) {
      dispatch(fetchProductsList());
    }
  }, [dispatch, genericProducts.length]);

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

  return {
    userShoppingList,
    products: sortByLabel(allProducts),
    shoppingList: filledShoppingList,
    shelves,
    error: useSelector(getErrorMessage),
    resetErrorMsg: () => dispatch(resetErrorMessage()),
    shoppingMode,
    switchShoppingMode,
    itemsRemoved,
    removeItem,
    cancelRemoveItem,
    addItemFromProductArea,
    changeItemQuantity: (itemId, quantityToAdd) => dispatch(changeItemQuantityAndSave(itemId, quantityToAdd)),
    changeItemComment: (itemId, comment) => dispatch(changeItemCommentAndSave(itemId, comment)),
    createList: () => dispatch(createNewShoppingList()),
  };
}