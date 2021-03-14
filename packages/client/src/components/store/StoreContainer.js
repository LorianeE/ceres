import React from 'react';
import SnackbarError from '../common/SnackbarError';
import { useStore } from '../../redux/hooks/useStore';
import CreateStoreComponent from './CreateStoreComponent';
import AddProductArea from '../common/AddProductArea';
import Store from './Store';

const StoreContainer = () => {
  const { storeId, storeItems, products, error, addStoreItem, changeStoreItemQuantity, createStore, resetErrorMsg } = useStore();

  return (
    <>
      {!storeId ? (
        <CreateStoreComponent createStore={createStore} />
      ) : (
        <div style={{ marginTop: '30px' }}>
          <AddProductArea products={products} addItem={addStoreItem} />
          <Store storeItems={storeItems} changeItemQuantity={changeStoreItemQuantity} />
        </div>
      )}
      {error && <SnackbarError error={error} onClose={resetErrorMsg} />}
    </>
  );
};

export default StoreContainer;
