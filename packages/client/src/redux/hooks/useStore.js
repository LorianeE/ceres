import { useDispatch, useSelector } from 'react-redux';
import { getErrorMessage } from '../selectors/error.selectors';
import { resetErrorMessage } from '../actions/error.actions';
import { addStoreItemAndSave, changeStoreItemQuantityAndSave } from '../actions/store.actions';
import { getStoreId, getStoreItems } from '../selectors/store.selectors';
import { getFilledStore } from '../../utils/StoreMapper';
import { useProducts } from './useProducts';

export function useStore() {
  const dispatch = useDispatch();

  const { allProducts, productsSortedByLabel } = useProducts();

  const storeId = useSelector(getStoreId);
  const storeItems = useSelector(getStoreItems);
  const filledStore = storeItems && allProducts.length ? getFilledStore(storeItems, allProducts) : [];

  const addStoreItem = (item) => {
    const existingItem = filledStore && filledStore.find((i) => i.product.id === item.product.id);
    if (existingItem) {
      dispatch(changeStoreItemQuantityAndSave(existingItem.id, 1));
    } else {
      dispatch(
        addStoreItemAndSave({
          ...item,
          product: item.product.id,
          quantity: 1,
        })
      );
    }
  };

  return {
    storeId,
    storeItems: filledStore,
    products: productsSortedByLabel,
    error: useSelector(getErrorMessage),
    resetErrorMsg: () => dispatch(resetErrorMessage()),
    addStoreItem,
    changeStoreItemQuantity: (itemId, quantityToAdd) => dispatch(changeStoreItemQuantityAndSave(itemId, quantityToAdd)),
  };
}
