import React from 'react';
import EnhancedTable from './EnhancedTable';

const ProductsContainer = () => {
  const rows = [
    {
      id: 'Donut',
      label: 'Donut',
      shelf: 'Rayon frais',
      minimumQuantity: 0,
    },
    { id: 'Eclair', label: 'Eclair', shelf: 'Epicerie', minimumQuantity: 0 },
    { id: 'Frozen', label: 'Frozen yoghurt', shelf: 'Rayon frais', minimumQuantity: 0 },
    { id: 'Gingerbread', label: 'Gingerbread', shelf: 'Rayon frais', minimumQuantity: 0 },
    { id: 'Honeycomb', label: 'Honeycomb', shelf: 'Epicerie', minimumQuantity: 0 },
    { id: 'Ice', label: 'Ice cream sandwich', shelf: 'Rayon frais', minimumQuantity: 0 },
    { id: 'Jelly', label: 'Jelly Bean', shelf: 'Epicerie', minimumQuantity: 0 },
    { id: 'KitKat', label: 'KitKat', shelf: 'Epicerie', minimumQuantity: 0 },
    { id: 'Lollipop', label: 'Lollipop', shelf: 'Rayon frais', minimumQuantity: 0 },
    { id: 'Marshmallow', label: 'Marshmallow', shelf: 'Rayon frais', minimumQuantity: 0 },
    { id: 'Nougat', label: 'Nougat', shelf: 'Rayon frais', minimumQuantity: 0 },
    { id: 'Oreo', label: 'Oreo', shelf: 'Rayon frais', minimumQuantity: 0 },
  ];
  return <EnhancedTable rows={rows} />;
};

export default ProductsContainer;
