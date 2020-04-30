import React, { useState } from 'react';
import { connect } from 'react-redux';
import AddProductArea from '../components/shopping/AddProductArea';
import ShoppingList from '../components/shopping/ShoppingList';
import ShoppingHeader from '../components/shopping/ShoppingHeader';
import useShopping from '../utils/ShoppingUtils';
import { createShoppingList } from '../utils/http/ShoppingClient';
import CreateListComponent from '../components/shopping/CreateListComponent';

const ShoppingContainer = ({ user, products }) => {
  const [shoppingMode, setShoppingMode] = useState(false);
  const shopping = useShopping(user);
  const {
    shoppingList,
    shelves,
    changeItemQuantity,
    removeAddedItem,
    cancelRemoveItem,
    hasRemovedItems,
    cleanRemovedItems,
    updateShoppingList,
  } = shopping;

  const switchShoppingMode = () => {
    if (shoppingMode) {
      cleanRemovedItems();
    }
    setShoppingMode(!shoppingMode);
  };

  const createList = () => {
    createShoppingList().then((shopList) => updateShoppingList(shopList.id));
  };

  if (!shoppingList) {
    return <CreateListComponent createShoppingList={createList} />;
  }
  return (
    <div>
      <ShoppingHeader
        shoppingMode={shoppingMode}
        switchShoppingMode={switchShoppingMode}
        hasRemovedItems={hasRemovedItems}
        cancelRemoveItem={cancelRemoveItem}
      />
      {!shoppingMode && <AddProductArea products={products} addItem={(item) => changeItemQuantity(item, 1)} />}
      <ShoppingList
        shoppingList={shoppingList}
        shelves={shelves}
        removeAddedItem={removeAddedItem}
        shoppingMode={shoppingMode}
        changeItemQuantity={changeItemQuantity}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    products: [...state.products.dbList, ...state.products.userList],
  };
};

export default connect(mapStateToProps)(ShoppingContainer);
