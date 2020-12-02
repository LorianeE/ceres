import React from 'react';
import EnhancedTable from './components/EnhancedTable';
import { useUserProducts } from '../../redux/hooks/useUserProducts';

const ProductsContainer = () => {
  const { userProducts } = useUserProducts();

  return <EnhancedTable rows={userProducts} />;
};

export default ProductsContainer;
