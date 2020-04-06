import React from "react";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import ItemQuantity from "./ItemQuantity";

import {SHELF_TRANSLATION} from "../data/translation";

const ShoppingList = ({ shoppingList, classes, handleCheckItem, shoppingMode, changeItemQuantity}) => {

  const shelves = Array.from(new Set(shoppingList.map(item => item.shelf))).sort()

  return (
    <List className={classes.root} subheader={<li/>}>
      {shelves.map((shelf) => (
        <li key={shelf} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader>{SHELF_TRANSLATION[shelf]}</ListSubheader>
            {
              shoppingList.map((item) => {
                return item.shelf === shelf && (
                  <ListItem key={item.id} button disableRipple style={{cursor: 'default'}}>
                    {
                      shoppingMode && (
                        <Checkbox
                          edge="start"
                          defaultChecked={false}
                          onChange={handleCheckItem}
                          inputProps={{'aria-labelledby': `list-item-text-${item.id}`}}
                          id={item.id}
                        />
                      )
                    }
                    <ItemQuantity item={item} shoppingMode={shoppingMode} changeItemQuantity={changeItemQuantity}/>
                    <ListItemText id={`list-item-text-${item.id}`} primary={item.label}/>
                  </ListItem>
                )
              })
            }
          </ul>
        </li>
      ))}
    </List>
  )
};

export default ShoppingList
