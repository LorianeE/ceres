import { useEffect, useState } from 'react';
import * as _ from 'lodash';
import { getShoppingListItems, saveShoppingListItems } from './http/ShoppingClient';

function useShopping(user) {
  const shoppingListId = user ? user.shoppingListIds[0] : null;

  const [itemsRemoved, setItemsRemoved] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);

  const shelves = shoppingList && Array.from(new Set(shoppingList.map((shoppingListItem) => shoppingListItem.product.shelf))).sort();

  useEffect(() => {
    getShoppingListItems(shoppingListId).then(setShoppingList);
  }, [shoppingListId]);

  const changeItemQuantity = (item, quantityToAdd) => {
    const itemToUpdateIndex = shoppingList.findIndex((shoppingListItem) => shoppingListItem.product.id === item.product.id);
    if (itemToUpdateIndex !== -1) {
      const newQuantity = shoppingList[itemToUpdateIndex].quantity + quantityToAdd;
      if (newQuantity > 0) {
        shoppingList[itemToUpdateIndex].quantity = newQuantity;
      } else {
        shoppingList.splice(itemToUpdateIndex, 1);
      }
    } else {
      shoppingList.push({
        ...item,
        quantity: quantityToAdd,
      });
    }
    const newShoppingList = [...shoppingList];
    setShoppingList(newShoppingList);
    saveShoppingListItems(newShoppingList);
  };

  const removeAddedItem = (itemId) => {
    const removedItem = shoppingList.find((shoppingListItem) => shoppingListItem.product.id === itemId);
    changeItemQuantity(removedItem, -1);
    const newLastItemRemoved = { ...removedItem };
    newLastItemRemoved.quantity = 1;
    setItemsRemoved([...itemsRemoved, newLastItemRemoved]);
  };

  const cancelRemoveItem = () => {
    const lastItemRemoved = itemsRemoved[itemsRemoved.length - 1];
    const itemInListIndex = shoppingList.findIndex((shoppingListItem) => shoppingListItem.product.id === lastItemRemoved.product.id);
    const newShoppingList = _.clone(shoppingList);
    if (itemInListIndex >= 0) {
      newShoppingList[itemInListIndex].quantity += lastItemRemoved.quantity;
    } else {
      newShoppingList.push(lastItemRemoved);
    }
    const newItemsRemoved = itemsRemoved.slice(0, itemsRemoved.length - 1);
    setShoppingList(newShoppingList);
    setItemsRemoved([...newItemsRemoved]);
    saveShoppingListItems(newShoppingList);
  };

  return {
    shoppingList,
    shelves,
    changeItemQuantity,
    removeAddedItem,
    cancelRemoveItem,
    hasRemovedItems: itemsRemoved.length >= 1,
    cleanRemovedItems: () => setItemsRemoved([]),
  };
}

export default useShopping;
