import React, { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import ItemQuantity from './ItemQuantity';

const ShoppingListItem = ({ item, shoppingMode, removeItem, changeItemQuantity }) => {
  const [checked, setChecked] = useState(false);

  const removeAddedItemWithTimeOut = (e) => {
    const { id } = e.target;
    setChecked(true);
    setTimeout(() => {
      setChecked(false);
      removeItem(id);
    }, 200);
  };

  return (
    <ListItem button disableRipple style={{ cursor: 'default' }}>
      {shoppingMode && (
        <Checkbox
          edge="start"
          checked={checked}
          onChange={removeAddedItemWithTimeOut}
          inputProps={{
            'aria-labelledby': `list-item-text-${item.id}`,
          }}
          id={item.id}
        />
      )}
      <ItemQuantity item={item} shoppingMode={shoppingMode} changeItemQuantity={changeItemQuantity} />
      <ListItemText id={`list-item-text-${item.id}`} primary={item.product.label} />
    </ListItem>
  );
};

export default ShoppingListItem;
