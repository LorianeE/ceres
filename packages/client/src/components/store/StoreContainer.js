import React from 'react';
import SnackbarError from '../common/SnackbarError';
import { useStore } from '../../redux/hooks/useStore';
import AddProductArea from '../common/AddProductArea';
import Store from './Store';
import Spinner from '../common/Spinner';

const StoreContainer = () => {
  const { storeId, storeItems, products, error, addStoreItem, changeStoreItemQuantity, resetErrorMsg } = useStore();

  return (
    <>
      {!storeId ? (
        <Spinner />
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
