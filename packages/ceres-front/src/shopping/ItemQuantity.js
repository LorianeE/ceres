import ListItemIcon from '@material-ui/core/ListItemIcon';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import RemoveIcon from '@material-ui/icons/Remove';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';

const ItemQuantity = ({ item, shoppingMode, changeItemQuantity }) => {
  if (shoppingMode) {
    return (
      <ListItemIcon style={{ minWidth: 25 }}>
        <Typography>{item.quantity}</Typography>
      </ListItemIcon>
    );
  }
  return (
    <ListItemIcon style={{ paddingRight: 20 }}>
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        <Button variant="contained" size="small" disableElevation onClick={() => changeItemQuantity(item, -1)}>
          <RemoveIcon fontSize="small" />
        </Button>
        <Button size="small" disabled>
          <Typography>{item.quantity}</Typography>
        </Button>
        <Button variant="contained" size="small" disableElevation onClick={() => changeItemQuantity(item, 1)}>
          <AddIcon fontSize="small" />
        </Button>
      </ButtonGroup>
    </ListItemIcon>
  );
};

export default ItemQuantity;
