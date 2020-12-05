import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getUserProducts } from '../selectors/products.selectors';
import { addProduct, fetchUserProductsList, updateProduct } from '../actions/products.actions';

export function useEditProductForm() {
  const dispatch = useDispatch();

  const productId = useParams().id;
  const userProductsList = useSelector(getUserProducts);
  const product = userProductsList.find((pdt) => pdt.id === productId);

  useEffect(() => {
    if (!Array.isArray(userProductsList)) {
      dispatch(fetchUserProductsList());
    }
  }, [dispatch, userProductsList]);

  return {
    product,
    editProduct: (p) => dispatch(updateProduct(p)),
    addProduct: (p) => dispatch(addProduct(p)),
  };
}
