import React from 'react'
import './App.css'
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import {ThemeProvider} from '@material-ui/core/styles'
import {useStyles, theme} from './style'
import Nav from "./structureComponents/Nav";
import TopBar from "./structureComponents/TopBar";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import KitchenIcon from "@material-ui/icons/Kitchen";
import RestaurantMenuIcon from "@material-ui/icons/RestaurantMenu";
import MenuBookIcon from "@material-ui/icons/MenuBook";

const menu = [
  {
    id: 1,
    text: 'Liste de courses',
    icon: ShoppingCartIcon
  },
  {
    id: 2,
    text: 'Réserve',
    icon: KitchenIcon
  },
  {
    id: 3,
    text: 'Menu',
    icon: RestaurantMenuIcon
  },
  {
    id: 4,
    text: 'Recettes',
    icon: MenuBookIcon
  }
];

function App() {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerItemClick = (itemId) => {
    console.log(itemId)
    setTimeout(() => {
      if (mobileOpen) {
        handleDrawerToggle()
      }
    }, 150)
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline/>
        <Nav classes={classes} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} menu={menu} handleDrawerItemClick={handleDrawerItemClick}/>
        <main className={classes.content}>
          <TopBar classes={classes} handleDrawerToggle={handleDrawerToggle}/>
          <div className={classes.toolbar}/>
          <Typography paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
            facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
            gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
            donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
            adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
            Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
            imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
            arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
            donec massa sapien faucibus et molestie ac.
          </Typography>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
