import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import EnhancedTable from './components/EnhancedTable';
import { useUserProducts } from '../../redux/hooks/useUserProducts';

const ProductsContainer = () => {
  const { userProducts, deleteProducts } = useUserProducts();
  return (
    <div>
      <Button
        startIcon={<AddRoundedIcon />}
        variant="contained"
        color="secondary"
        style={{ margin: '8px' }}
        component={Link}
        to="/products/add"
      >
        Ajouter un nouveau produit
      </Button>
      <EnhancedTable rows={userProducts} deleteProducts={deleteProducts} />
    </div>
  );
};

export default ProductsContainer;
