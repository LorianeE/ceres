import {useState, useEffect} from "react";
import shoppingListData from '../data/shoppingList.json'

// const STORE_KEY = 'appState';

// export function setStorageState (state) {
//   localStorage.setItem(STORE_KEY, JSON.stringify(state))
// }
//
// export function getStorageState () {
//   try {
//     return JSON.parse(localStorage.getItem(STORE_KEY))
//   } catch (er) {
//     return {}
//   }
// }
//
// async function getShoppingList () {
//   const { shoppingList = [] } = getStorageState();
//   setStorageState({
//     shoppingList
//   });
//   return shoppingList
// }

function useShopping () {
  const [itemsRemoved, setItemsRemoved] = useState([]);
  const [shoppingList, setShoppingList] = useState(shoppingListData);

  const shelves = Array.from(new Set(shoppingList.map(item => item.shelf))).sort();

  // TODO
  // useEffect(() => {
  //   getShoppingList().then(setShoppingList)
  // }, [getShoppingList])

  const changeItemQuantity = (item, quantityToAdd) => {
    let itemToUpdateIndex = shoppingList.findIndex(product => product.id === item.id);
    if (itemToUpdateIndex !== -1) {
      const newQuantity = shoppingList[itemToUpdateIndex].quantity + quantityToAdd;
      if (newQuantity > 0) {
        shoppingList[itemToUpdateIndex].quantity = newQuantity
      } else {
        shoppingList.splice(itemToUpdateIndex, 1)
      }
    } else {
      shoppingList.push({
        ...item,
        quantity: quantityToAdd
      })
    }
    const newShoppingList = [...shoppingList];
    setShoppingList(newShoppingList)
    // call Server
  };

  const removeAddedItem = (itemId) => {
    const newShoppingList = shoppingList.filter(item => item.id !== itemId);
    const newLastItemRemoved = shoppingList.find(item => item.id === itemId);
    setShoppingList([...newShoppingList]);
    setItemsRemoved([...itemsRemoved, newLastItemRemoved])
    // callServer
  };

  const cancelRemoveItem = () => {
    const newShoppingList = [...shoppingList, itemsRemoved[itemsRemoved.length - 1]];
    const newItemsRemoved = itemsRemoved.slice(0, itemsRemoved.length - 1);
    setShoppingList(newShoppingList);
    setItemsRemoved([...newItemsRemoved])
    // callServer
  };

  return {
    shoppingList,
    shelves,
    changeItemQuantity,
    removeAddedItem,
    cancelRemoveItem,
    hasRemovedItems: itemsRemoved.length >= 1,
    cleanRemovedItems: () => setItemsRemoved([])
  }
}

export default useShopping
