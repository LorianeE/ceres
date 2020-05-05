import React from 'react';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';

import Box from '@material-ui/core/Box';
import { SHELF_TYPES } from '../../data/shelf_types';
import useStyles from './shoppingStyle';
import ShoppingListItem from './ShoppingListItem';

const ShoppingList = ({ shoppingList, shelves, removeItem, shoppingMode, changeItemQuantity }) => {
  const classes = useStyles();

  if (!shoppingList.length) {
    return (
      <Box m={2} textAlign="center">
        <Typography>Aucun produit dans la liste de courses !</Typography>
      </Box>
    );
  }
  return (
    <List className={classes.root} subheader={<li />}>
      {shoppingList.length > 0 &&
        shelves.map((shelf) => (
          <li key={shelf} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader>{SHELF_TYPES[shelf]}</ListSubheader>
              {shoppingList.map((item) => {
                return (
                  item.product.shelf === shelf && (
                    <ShoppingListItem
                      key={item.id}
                      item={item}
                      shoppingMode={shoppingMode}
                      removeItem={removeItem}
                      changeItemQuantity={changeItemQuantity}
                    />
                  )
                );
              })}
            </ul>
          </li>
        ))}
    </List>
  );
};

export default ShoppingList;
