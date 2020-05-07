import PropTypes from 'prop-types';
import './ItemQuantity.css';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import RemoveIcon from '@material-ui/icons/Remove';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';

const ItemQuantity = ({ item, shoppingMode, changeItemQuantity }) => {
  const [itemQuantity, setItemQuantity] = useState(item.quantity);

  useEffect(() => {
    setItemQuantity(item.quantity);
  }, [item.quantity]);

  if (shoppingMode) {
    return (
      <ListItemIcon style={{ minWidth: 25 }}>
        <Typography>{item.quantity}</Typography>
      </ListItemIcon>
    );
  }
  return (
    <ListItemIcon style={{ paddingRight: 20 }}>
      <ButtonGroup color="primary" aria-label="outlined primary button group" disableRipple disableFocusRipple>
        <Button variant="contained" size="small" disableElevation onClick={() => changeItemQuantity(item.id, -1)}>
          <RemoveIcon fontSize="small" />
        </Button>
        <Button size="small" key={`itemQuantity:${itemQuantity}`}>
          <TextField
            id="itemQuantity"
            size="small"
            defaultValue={itemQuantity}
            type="number"
            InputProps={{ disableUnderline: true, inputProps: { style: { textAlign: 'center' } } }}
            style={{ width: '30px' }}
            onBlur={(e) => changeItemQuantity(item.id, Number(e.target.value) - item.quantity)}
          />
        </Button>
        <Button variant="contained" size="small" disableElevation onClick={() => changeItemQuantity(item.id, 1)}>
          <AddIcon fontSize="small" />
        </Button>
      </ButtonGroup>
    </ListItemIcon>
  );
};

ItemQuantity.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  shoppingMode: PropTypes.bool.isRequired,
  changeItemQuantity: PropTypes.func.isRequired,
};

export default ItemQuantity;
