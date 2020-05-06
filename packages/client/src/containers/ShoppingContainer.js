import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import AddProductArea from '../components/shopping/AddProductArea';
import ShoppingList from '../components/shopping/ShoppingList';
import ShoppingHeader from '../components/shopping/ShoppingHeader';
import CreateListComponent from '../components/shopping/CreateListComponent';
import { fetchDBProductsList } from '../redux/actions/productsAction';
import Spinner from '../components/structureComponents/Spinner';
import { addItemAndSave, changeItemQuantityAndSave, fetchShoppingList } from '../redux/actions/shoppingAction';
import { createNewShoppingList } from '../redux/actions/userAction';
import { getFilledShoppingList } from '../utils/ShoppingListMapper';

const ShoppingContainer = ({
  userShoppingList,
  fetchProducts,
  fetchList,
  products,
  loading,
  shoppingList,
  shelves,
  changeItemQuantity,
  addItem,
  createList,
}) => {
  const [shoppingMode, setShoppingMode] = useState(false);
  const [itemsRemoved, setItemsRemoved] = useState([]);

  useEffect(() => {
    if (!products.length) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  useEffect(() => {
    if (userShoppingList && !shoppingList.length) {
      fetchList(userShoppingList);
    }
  }, [fetchList, shoppingList.length, userShoppingList]);

  const switchShoppingMode = () => {
    if (shoppingMode) {
      setItemsRemoved([]);
    }
    setShoppingMode(!shoppingMode);
  };

  const removeItem = (itemId) => {
    const removedItem = shoppingList.find((item) => item.id === itemId);
    changeItemQuantity(itemId, -1);
    const newLastItemRemoved = {
      ...removedItem,
      quantity: 1,
    };
    setItemsRemoved([...itemsRemoved, newLastItemRemoved]);
  };

  const cancelRemoveItem = () => {
    const lastItemRemoved = itemsRemoved[itemsRemoved.length - 1];
    const itemInList = shoppingList.find((item) => item.id === lastItemRemoved.id);
    if (itemInList) {
      changeItemQuantity(itemInList.id, lastItemRemoved.quantity);
    } else {
      addItem(lastItemRemoved);
    }
    const newItemsRemoved = itemsRemoved.slice(0, itemsRemoved.length - 1);
    setItemsRemoved(newItemsRemoved);
  };

  const addItemFromProductArea = (item) => {
    const existingItem = shoppingList && shoppingList.find((i) => i.product.id === item.product.id);
    if (existingItem) {
      changeItemQuantity(existingItem.id, 1);
    } else {
      addItem({
        ...item,
        quantity: 1,
      });
    }
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      {!userShoppingList ? (
        <CreateListComponent createShoppingList={createList} />
      ) : (
        <>
          <ShoppingHeader
            shoppingMode={shoppingMode}
            switchShoppingMode={switchShoppingMode}
            hasRemovedItems={itemsRemoved.length >= 1}
            cancelRemoveItem={cancelRemoveItem}
          />
          {!shoppingMode && <AddProductArea products={products} addItem={addItemFromProductArea} />}
          <ShoppingList
            shoppingList={shoppingList}
            shelves={shelves}
            removeItem={removeItem}
            shoppingMode={shoppingMode}
            changeItemQuantity={changeItemQuantity}
          />
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userShoppingList: state.user.shoppingLists[0],
    products: [...state.products.dbList, ...state.products.userList],
    loading: state.apiCallsInProgress > 0,
    shoppingList: getFilledShoppingList(state.shoppingList.items, state.products.dbList),
    shelves: Array.from(
      new Set(getFilledShoppingList(state.shoppingList.items, state.products.dbList).map((item) => item.product.shelf))
    ).sort(),
  };
};

const mapDispatchToProps = {
  fetchProducts: fetchDBProductsList,
  fetchList: fetchShoppingList,
  changeItemQuantity: changeItemQuantityAndSave,
  addItem: addItemAndSave,
  createList: createNewShoppingList,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingContainer);
