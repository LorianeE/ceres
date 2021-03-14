import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import useStyles from './storeStyle';
import StoreItem from './StoreItem';
import { PRODUCT_PLACES, PRODUCT_PLACES_ARRAY } from '../../data/shelf_types';

const Store = ({ storeItems, changeItemQuantity }) => {
  const classes = useStyles();

  const places =
    storeItems && PRODUCT_PLACES_ARRAY.filter((place) => storeItems.find((item) => PRODUCT_PLACES[item.product.shelf] === place));

  if (!storeItems.length) {
    return (
      <Box m={2} textAlign="center">
        <Typography>Aucun produit dans la réserve !</Typography>
      </Box>
    );
  }

  return (
    <List className={classes.root} subheader={<li />}>
      {storeItems.length > 0 &&
        places.map((place) => (
          <li key={place} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader>{place}</ListSubheader>
              {storeItems.map((item) => {
                return (
                  PRODUCT_PLACES[item.product.shelf] === place && (
                    <StoreItem key={item.product.id} item={item} changeItemQuantity={changeItemQuantity} />
                  )
                );
              })}
            </ul>
          </li>
        ))}
    </List>
  );
};

Store.propTypes = {
  storeItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  changeItemQuantity: PropTypes.func.isRequired,
};

export default Store;
