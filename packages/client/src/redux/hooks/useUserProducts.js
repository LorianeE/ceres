import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProducts } from '../selectors/products.selectors';
import { deleteProducts, fetchUserProductsList } from '../actions/products.actions';

export function useUserProducts() {
  const dispatch = useDispatch();

  const userProductsList = useSelector(getUserProducts);

  useEffect(() => {
    if (!userProductsList.length) {
      dispatch(fetchUserProductsList());
    }
  }, [dispatch, userProductsList]);

  return {
    userProducts: userProductsList,
    deleteProducts: (productIds) => dispatch(deleteProducts(productIds)),
  };
}
