import PropTypes from 'prop-types';
import './ItemQuantity.css';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';

const ItemQuantity = ({ item, changeItemQuantity }) => {
  const [itemQuantity, setItemQuantity] = useState(item.quantity);

  useEffect(() => {
    setItemQuantity(item.quantity);
  }, [item.quantity]);

  return (
    <ListItemIcon style={{ paddingRight: 15 }}>
      <ButtonGroup size="small" color="primary" aria-label="outlined primary button group" disableRipple disableFocusRipple>
        <Button variant="contained" disableElevation onClick={() => changeItemQuantity(item.id, -1)}>
          <RemoveIcon fontSize="small" />
        </Button>
        <Button key={`itemQuantity:${item.id}:${itemQuantity}`} style={{ padding: '1px 5px' }}>
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
        <Button variant="contained" disableElevation onClick={() => changeItemQuantity(item.id, 1)}>
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
  changeItemQuantity: PropTypes.func.isRequired,
};

export default ItemQuantity;
