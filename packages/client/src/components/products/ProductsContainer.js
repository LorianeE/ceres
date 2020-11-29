import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EnhancedTable from './components/EnhancedTable';
import { fetchUserProductsList } from '../../redux/actions/productsAction';
import { SHELF_TYPES } from '../../data/shelf_types';

const ProductsContainer = ({ userProducts, fetchProducts }) => {
  useEffect(() => {
    if (!userProducts.length) {
      fetchProducts();
    }
  }, [fetchProducts, userProducts.length]);

  return <EnhancedTable rows={userProducts} />;
};

ProductsContainer.propTypes = {
  userProducts: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchProducts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    userProducts: state.products.userList.map((product) => {
      product.shelf = SHELF_TYPES[product.shelf];
      return product;
    }),
  };
};

const mapDispatchToProps = {
  fetchProducts: fetchUserProductsList,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductsContainer);
