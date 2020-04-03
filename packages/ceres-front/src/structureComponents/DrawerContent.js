import React from "react";
import logo from "../logo.png";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import {useStyles} from '../style'


const DrawerContent = ({menu, handleDrawerItemClick}) => {
  const classes = useStyles();
  return (
    <div>
      <img src={logo} alt="Ceres logo" className={classes.fitPicture}/>
      <Divider/>
      <List>
        {
          menu.map(({ id, text, icon}) => {
            const ListIconComponent = icon;
            return (
              <ListItem button key={text} onClick={() => handleDrawerItemClick(id)}>
                <ListItemIcon><ListIconComponent /></ListItemIcon>
                <ListItemText primary={text}/>
              </ListItem>
            )
          })
        }
      </List>
    </div>
  )
};

export default DrawerContent
