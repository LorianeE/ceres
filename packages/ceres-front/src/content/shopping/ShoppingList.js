import React from "react";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import ListItemText from "@material-ui/core/ListItemText";

import {SHELF_TRANSLATION} from "../data/translation";

const ShoppingList = ({ shoppingList, classes, handleCheckItem, shoppingMode}) => {

  const shelves = Array.from(new Set(shoppingList.map(item => item.shelf))).sort()

  return (
    <List className={classes.root} subheader={<li/>}>
      {shelves.map((shelf) => (
        <li key={shelf} className={classes.listSection}>
          <ul className={classes.ul}>
            <ListSubheader>{SHELF_TRANSLATION[shelf]}</ListSubheader>
            {
              shoppingList.map(({id, label, quantity, shelf: itemShelf}) => {
                return itemShelf === shelf && (
                  <ListItem key={id} button disableRipple onClick={() => {
                  }} style={{cursor: 'default'}}>
                    {
                      shoppingMode && (
                        <Checkbox
                          edge="start"
                          defaultChecked={false}
                          onChange={handleCheckItem}
                          inputProps={{'aria-labelledby': `list-item-text-${id}`}}
                          id={id}
                        />
                      )
                    }
                    <ListItemIcon style={{minWidth: 25}}>
                      <Typography>
                        {quantity}
                      </Typography>
                    </ListItemIcon>
                    <ListItemText id={`list-item-text-${id}`} primary={label}/>
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
