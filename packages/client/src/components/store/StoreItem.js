import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import ItemQuantity from '../common/item/ItemQuantity';

const StoreItem = ({ item, changeItemQuantity }) => {
  return (
    <Box>
      <ListItem button disableRipple style={{ cursor: 'default' }}>
        <Grid container spacing={1}>
          <Grid item style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <ItemQuantity item={item} changeItemQuantity={changeItemQuantity} className="itemQuantity" />
          </Grid>
          <Grid item xs sm md style={{ marginTop: 'auto', marginBottom: 'auto', maxWidth: '230px' }}>
            <ListItemText id={`list-item-text-${item.id}`} primary={item.product.label} />
          </Grid>
        </Grid>
      </ListItem>
    </Box>
  );
};

StoreItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    product: PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      minimumQuantity: PropTypes.number.isRequired,
      shelf: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  changeItemQuantity: PropTypes.func.isRequired,
};

export default StoreItem;
