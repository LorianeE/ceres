import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { sortByLabel } from '../../utils/ProductsUtils';
import { getGenericProducts, getUserProducts } from '../selectors/products.selectors';
import { getErrorMessage } from '../selectors/error.selectors';
import { fetchProductsList, fetchUserProductsList } from '../actions/products.actions';
import { resetErrorMessage } from '../actions/error.actions';
import { addStoreItemAndSave, changeStoreItemQuantityAndSave, createNewStore, fetchStore } from '../actions/store.actions';
import { getStoreId, getStoreItems } from '../selectors/store.selectors';
import { getFilledStore } from '../../utils/StoreMapper';

export function useStore() {
  const dispatch = useDispatch();

  const genericProducts = useSelector(getGenericProducts);
  const userProducts = useSelector(getUserProducts);
  const allProducts = genericProducts && userProducts && [...genericProducts, ...userProducts];

  const storeId = useSelector(getStoreId);
  const storeItems = useSelector(getStoreItems);
  const filledStore = storeItems && allProducts ? getFilledStore(storeItems, allProducts) : [];

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

  useEffect(() => {
    if (!genericProducts) {
      dispatch(fetchProductsList());
    }
  }, [dispatch, genericProducts]);

  useEffect(() => {
    if (!Array.isArray(userProducts)) {
      dispatch(fetchUserProductsList());
    }
  }, [dispatch, userProducts]);

  useEffect(() => {
    // TODO: Attention en cas d'absence de store: du coup créer un store par défaut ?
    if (!storeItems) {
      dispatch(fetchStore());
    }
  }, [dispatch, storeItems]);

  return {
    storeId,
    storeItems: filledStore,
    products: sortByLabel(allProducts),
    error: useSelector(getErrorMessage),
    resetErrorMsg: () => dispatch(resetErrorMessage()),
    addStoreItem,
    changeStoreItemQuantity: (itemId, quantityToAdd) => dispatch(changeStoreItemQuantityAndSave(itemId, quantityToAdd)),
    createStore: () => dispatch(createNewStore()),
  };
}
