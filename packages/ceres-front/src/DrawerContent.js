import React from "react";
import logo from "./logo.png";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import ListItemText from "@material-ui/core/ListItemText";
import KitchenIcon from "@material-ui/icons/Kitchen";
import RestaurantMenuIcon from "@material-ui/icons/RestaurantMenu";
import MenuBookIcon from "@material-ui/icons/MenuBook";

import {useStyles} from './style'


const DrawerContent = ({props}) => {
  const classes = useStyles();
  return (
    <div>
      <img src={logo} alt="Ceres logo" className={classes.fitPicture}/>
      <Divider/>
      <List>
        <ListItem button key="Liste de courses">
          <ListItemIcon><ShoppingCartIcon/></ListItemIcon>
          <ListItemText primary="Liste de courses"/>
        </ListItem>
        <ListItem button key="Réserve">
          <ListItemIcon><KitchenIcon/></ListItemIcon>
          <ListItemText primary="Réserve"/>
        </ListItem>
        <ListItem button key="Menu">
          <ListItemIcon><RestaurantMenuIcon/></ListItemIcon>
          <ListItemText primary="Menu"/>
        </ListItem>
        <ListItem button key="Recettes">
          <ListItemIcon><MenuBookIcon/></ListItemIcon>
          <ListItemText primary="Recettes"/>
        </ListItem>
      </List>
    </div>
  )
}

export default DrawerContent
