import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ItemQuantity from './ItemQuantity';
import ItemComment from './ItemComment';

const ShoppingListItem = ({ item, changeItemQuantity, changeItemComment }) => {
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
          <Grid item xs={12} sm={12} md style={{ marginTop: 'auto' }}>
            <ItemComment item={item} changeItemComment={changeItemComment} />
          </Grid>
        </Grid>
      </ListItem>
    </Box>
  );
};

ShoppingListItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    product: PropTypes.objectOf(PropTypes.object()).isRequired,
    comment: PropTypes.string,
  }).isRequired,
  changeItemQuantity: PropTypes.func.isRequired,
  changeItemComment: PropTypes.func.isRequired,
};

export default ShoppingListItem;
