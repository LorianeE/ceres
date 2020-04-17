import React from 'react';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';

import { SHELF_TYPES } from '../data/shelf_types';
import useStyles from './shoppingStyle';
import ShoppingListItem from './ShoppingListItem';

const ShoppingList = ({
  shoppingList,
  shelves,
  removeAddedItem,
  shoppingMode,
  changeItemQuantity,
}) => {
  const classes = useStyles();

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
                      key={item.product.id}
                      item={item}
                      shoppingMode={shoppingMode}
                      removeAddedItem={removeAddedItem}
                      changeItemQuantity={changeItemQuantity}
                    />
                  )
                );
              })}
            </ul>
          </li>
        ))}
      {!shoppingList.length && (
        <Typography>Aucun produit dans la liste de courses !</Typography>
      )}
    </List>
  );
};

export default ShoppingList;
