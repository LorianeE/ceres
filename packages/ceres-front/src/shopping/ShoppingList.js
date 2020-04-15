import React from "react";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";

import {SHELF_TRANSLATION} from "../data/translation";
import useStyles from "./shoppingStyle";
import ShoppingListItem from "./ShoppingListItem";

const ShoppingList = ({shoppingList, shelves, removeAddedItem, shoppingMode, changeItemQuantity}) => {

  const classes = useStyles();

  return (
    <List className={classes.root} subheader={<li/>}>
      {shelves.map((shelf) => (
        <li key={shelf} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader>{SHELF_TRANSLATION[shelf]}</ListSubheader>
            {
              shoppingList.map((item) => {
                return item.shelf === shelf &&
                  <ShoppingListItem
                    item={item}
                    shoppingMode={shoppingMode}
                    removeAddedItem={removeAddedItem}
                    changeItemQuantity={changeItemQuantity}
                  />
              })
            }
          </ul>
        </li>
      ))}
    </List>
  )
};

export default ShoppingList
