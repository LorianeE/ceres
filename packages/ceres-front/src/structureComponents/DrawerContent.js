import React from "react";
import {Link} from "react-router-dom";
import logo from "../logo.png";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const DrawerContent = ({menu, handleDrawerItemClick, classes}) => {
  return (
    <div>
      <img src={logo} alt="Ceres logo" className={classes.fitPicture}/>
      <Divider/>
      <List>
        {
          menu.map(({id, text, icon, path}) => {
            const ListIconComponent = icon;
            return (
              <ListItem key={id} button onClick={() => handleDrawerItemClick(id)} component={Link} to={path}>
                <ListItemIcon><ListIconComponent/></ListItemIcon>
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
