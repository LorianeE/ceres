import { useDispatch, useSelector } from 'react-redux';
import { sortByLabel } from '../../utils/ProductsUtils';
import { getGenericProducts, getUserProducts } from '../selectors/products.selectors';
import { getErrorMessage } from '../selectors/error.selectors';
import { resetErrorMessage } from '../actions/error.actions';
import { addStoreItemAndSave, changeStoreItemQuantityAndSave, createNewStore } from '../actions/store.actions';
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
