import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';

const ItemShopModeOn = ({ item, removeItem }) => {
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
    <ListItem button disableRipple style={{ cursor: 'default', paddingTop: '0px', paddingBottom: '0px' }}>
      <Grid container>
        <Grid item>
          <Checkbox
            edge="start"
            checked={checked}
            onChange={removeAddedItemWithTimeOut}
            inputProps={{
              'aria-labelledby': `list-item-text-${item.id}`,
            }}
            id={item.id}
          />
          <ListItemIcon style={{ minWidth: 25 }}>
            <Typography>{item.quantity}</Typography>
          </ListItemIcon>
        </Grid>
        <Grid item xs sm md style={{ marginTop: 'auto', marginBottom: 'auto', maxWidth: '230px' }}>
          <ListItemText id={`list-item-text-${item.id}`} primary={item.product.label} />
        </Grid>
        {item.comment && (
          <Grid item xs={12} sm md style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: '55px' }} className="test">
            <ListItemText id={`list-item-text-comment-${item.id}`} primary={item.comment} />
          </Grid>
        )}
      </Grid>
    </ListItem>
  );
};

ItemShopModeOn.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    product: PropTypes.objectOf(PropTypes.object()).isRequired,
    comment: PropTypes.string,
  }).isRequired,
  removeItem: PropTypes.func.isRequired,
};

export default ItemShopModeOn;
