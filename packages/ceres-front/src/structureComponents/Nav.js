import React from 'react'
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import {theme} from "../style";
import DrawerContent from "./DrawerContent";

const Nav = ({classes, mobileOpen, handleDrawerToggle, menu, handleDrawerItemClick}) => {
  return (
    <nav className={classes.drawer} aria-label="app folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <DrawerContent menu={menu} handleDrawerItemClick={handleDrawerItemClick}/>
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          <DrawerContent menu={menu} handleDrawerItemClick={handleDrawerItemClick}/>
        </Drawer>
      </Hidden>
    </nav>
  )
};

export default Nav
