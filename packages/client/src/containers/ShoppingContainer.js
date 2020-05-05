import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import AddProductArea from '../components/shopping/AddProductArea';
import ShoppingList from '../components/shopping/ShoppingList';
import ShoppingHeader from '../components/shopping/ShoppingHeader';
import CreateListComponent from '../components/shopping/CreateListComponent';
import { fetchDBProductsList } from '../redux/actions/productsAction';
import Spinner from '../components/structureComponents/Spinner';
import { addItem, changeItemQuantity, fetchShoppingList } from '../redux/actions/shoppingAction';

// eslint-disable-next-line no-shadow
const ShoppingContainer = ({ user, fetchProducts, fetchList, products, loading, shoppingList, shelves, changeItemQuantity, addItem }) => {
  const [shoppingMode, setShoppingMode] = useState(false);
  const [itemsRemoved, setItemsRemoved] = useState([]);

  useEffect(() => {
    if (!products.length) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  useEffect(() => {
    fetchList(user.shoppingLists[0]);
  }, [fetchList, user.shoppingLists]);

  const switchShoppingMode = () => {
    if (shoppingMode) {
      setItemsRemoved([]);
    }
    setShoppingMode(!shoppingMode);
  };

  const createList = () => {
    // createShoppingList().then((shopList) => updateShoppingList(shopList.id));
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

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      {!shoppingList ? (
        <CreateListComponent createShoppingList={createList} />
      ) : (
        <>
          <ShoppingHeader
            shoppingMode={shoppingMode}
            switchShoppingMode={switchShoppingMode}
            hasRemovedItems={itemsRemoved.length >= 1}
            cancelRemoveItem={cancelRemoveItem}
          />
          {!shoppingMode && <AddProductArea products={products} addItem={(item) => changeItemQuantity(item.id, 1)} />}
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

function getCompleteItems(storeItems, products) {
  if (!storeItems || !products.length) {
    return [];
  }
  const itemsArray = Object.values(storeItems);
  return itemsArray.map((item) => {
    return {
      ...item,
      product: products.find((product) => product.id === item.product),
    };
  });
}

const mapStateToProps = (state) => {
  return {
    products: [...state.products.dbList, ...state.products.userList],
    loading: state.apiCallsInProgress > 0,
    shoppingList: getCompleteItems(state.shoppingList.items, state.products.dbList),
    shelves: Array.from(
      new Set(getCompleteItems(state.shoppingList.items, state.products.dbList).map((item) => item.product.shelf))
    ).sort(),
  };
};

const mapDispatchToProps = {
  fetchProducts: fetchDBProductsList,
  fetchList: fetchShoppingList,
  changeItemQuantity,
  addItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingContainer);
