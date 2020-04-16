import { useState, useEffect } from 'react';
import { getShoppingList, saveShoppingList } from '../utils/ShoppingClient';

function useShopping() {
  const [itemsRemoved, setItemsRemoved] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);

  const shelves = Array.from(
    new Set(shoppingList.map((item) => item.shelf))
  ).sort();

  useEffect(() => {
    getShoppingList().then(setShoppingList);
  }, []);

  const changeItemQuantity = (item, quantityToAdd) => {
    const itemToUpdateIndex = shoppingList.findIndex(
      (product) => product.id === item.id
    );
    if (itemToUpdateIndex !== -1) {
      const newQuantity =
        shoppingList[itemToUpdateIndex].quantity + quantityToAdd;
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
    saveShoppingList(newShoppingList);
  };

  const removeAddedItem = (itemId) => {
    const newShoppingList = shoppingList.filter((item) => item.id !== itemId);
    const newLastItemRemoved = shoppingList.find((item) => item.id === itemId);
    setShoppingList([...newShoppingList]);
    setItemsRemoved([...itemsRemoved, newLastItemRemoved]);
    saveShoppingList(newShoppingList);
  };

  const cancelRemoveItem = () => {
    const newShoppingList = [
      ...shoppingList,
      itemsRemoved[itemsRemoved.length - 1],
    ];
    const newItemsRemoved = itemsRemoved.slice(0, itemsRemoved.length - 1);
    setShoppingList(newShoppingList);
    setItemsRemoved([...newItemsRemoved]);
    saveShoppingList(newShoppingList);
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
