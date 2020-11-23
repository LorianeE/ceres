import React from 'react';
import PropTypes from 'prop-types';
import ItemShopModeOn from './item/ItemShopModeOn';
import ItemShopModeOff from './item/ItemShopModeOff';

const ShoppingListItem = ({ item, shoppingMode, removeItem, changeItemQuantity, changeItemComment }) => {
  console.log('item');
  console.log(item);
  if (shoppingMode) {
    return <ItemShopModeOn item={item} removeItem={removeItem} />;
  }
  return <ItemShopModeOff item={item} changeItemQuantity={changeItemQuantity} changeItemComment={changeItemComment} />;
};

ShoppingListItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    product: PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      minimumQuantity: PropTypes.number.isRequired,
      shelf: PropTypes.string.isRequired,
    }).isRequired,
    comment: PropTypes.string,
  }).isRequired,
  shoppingMode: PropTypes.bool.isRequired,
  removeItem: PropTypes.func.isRequired,
  changeItemQuantity: PropTypes.func.isRequired,
  changeItemComment: PropTypes.func.isRequired,
};

export default ShoppingListItem;
