import React from 'react';
import AddProductArea from './components/AddProductArea';
import ShoppingList from './components/ShoppingList';
import ShoppingHeader from './components/ShoppingHeader';
import CreateListComponent from './components/CreateListComponent';
// import Spinner from '../common/Spinner';
import SnackbarError from '../common/SnackbarError';
import { useShopping } from '../../redux/hooks/useShopping';

const ShoppingContainer = () => {
  // if (loading) {
  //   return <Spinner />;
  // }
  const {
    userShoppingList,
    products,
    shoppingList,
    shelves,
    error,
    shoppingMode,
    switchShoppingMode,
    itemsRemoved,
    removeItem,
    cancelRemoveItem,
    addItemFromProductArea,
    changeItemQuantity,
    changeItemComment,
    createList,
    resetErrorMsg,
  } = useShopping();

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
            changeItemComment={changeItemComment}
          />
        </>
      )}
      {error && <SnackbarError error={error} onClose={resetErrorMsg} />}
    </>
  );
};

export default ShoppingContainer;
