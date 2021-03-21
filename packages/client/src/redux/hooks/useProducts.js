import { useSelector } from 'react-redux';
import { getGenericProducts, getUserProducts } from '../selectors/products.selectors';
import { sortByLabel } from '../../utils/ProductsUtils';

export function useProducts() {
  const genericProducts = useSelector(getGenericProducts);
  const userProducts = useSelector(getUserProducts);
  const allProducts = genericProducts && userProducts ? [...genericProducts, ...userProducts] : [];

  return {
    allProducts,
    productsSortedByLabel: sortByLabel(allProducts),
  };
}
