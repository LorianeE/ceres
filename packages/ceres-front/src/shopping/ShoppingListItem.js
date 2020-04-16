import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import ItemQuantity from './ItemQuantity';

const ShoppingListItem = ({
  item,
  shoppingMode,
  removeAddedItem,
  changeItemQuantity,
}) => {
  const removeAddedItemWithTimeOut = (e) => {
    const { id } = e.target;
    setTimeout(() => removeAddedItem(id), 200);
  };

  return (
    <ListItem button disableRipple style={{ cursor: 'default' }}>
      {shoppingMode && (
        <Checkbox
          edge="start"
          defaultChecked={false}
          onChange={removeAddedItemWithTimeOut}
          inputProps={{ 'aria-labelledby': `list-item-text-${item.id}` }}
          id={item.id}
        />
      )}
      <ItemQuantity
        item={item}
        shoppingMode={shoppingMode}
        changeItemQuantity={changeItemQuantity}
      />
      <ListItemText id={`list-item-text-${item.id}`} primary={item.label} />
    </ListItem>
  );
};

export default ShoppingListItem;
