import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import React from "react";

const TopBar = ({classes, handleDrawerToggle}) => {
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon/>
        </IconButton>
        <Typography variant="h6" noWrap style={{color: "white"}}>
          Liste de courses
        </Typography>
      </Toolbar>
    </AppBar>
  )
};

export default TopBar
