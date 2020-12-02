import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SHELF_TYPES } from '../../data/shelf_types';
import { getUserProducts } from '../selectors/products.selectors';
import { fetchUserProductsList } from '../actions/products.actions';

export function useUserProducts() {
  const dispatch = useDispatch();

  const userProductsList = useSelector(getUserProducts);

  useEffect(() => {
    if (!userProductsList.length) {
      dispatch(fetchUserProductsList());
    }
  }, [dispatch, userProductsList.length]);

  return {
    userProducts: userProductsList.map((product) => {
      product.shelf = SHELF_TYPES[product.shelf];
      return product;
    }),
  };
}
