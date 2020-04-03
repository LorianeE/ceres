import React from 'react';
import {
  Switch,
  Route,
  Redirect,
  useLocation
} from "react-router-dom";
import './App.css'
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import CssBaseline from '@material-ui/core/CssBaseline';
import {ThemeProvider} from '@material-ui/core/styles'
import {useStyles, theme} from './style'
import Nav from "./structureComponents/Nav";
import TopBar from "./structureComponents/TopBar";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import KitchenIcon from "@material-ui/icons/Kitchen";
import RestaurantMenuIcon from "@material-ui/icons/RestaurantMenu";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ShoppingList from "./content/ShoppingList";
import Store from "./content/Store";
import Menu from "./content/Menu";
import Recipes from "./content/Recipes";

const routes = [
  {
    id: 1,
    text: 'Liste de courses',
    icon: ShoppingCartIcon,
    path: '/shoppingList',
    component: ShoppingList
  },
  {
    id: 2,
    text: 'Réserve',
    icon: KitchenIcon,
    path: '/store',
    component: Store
  },
  {
    id: 3,
    text: 'Menu',
    icon: RestaurantMenuIcon,
    path: '/menu',
    component: Menu
  },
  {
    id: 4,
    text: 'Recettes',
    icon: MenuBookIcon,
    path: '/recipes',
    component: Recipes
  }
];

function App() {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerItemClick = (itemId) => {
    setTimeout(() => {
      if (mobileOpen) {
        handleDrawerToggle()
      }
    }, 150)
  };

  const location = useLocation();
  const currentRoute = routes.find(route => location.pathname === route.path)

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline/>
        <Nav classes={classes} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} menu={routes} handleDrawerItemClick={handleDrawerItemClick}/>
        <main className={classes.content}>
          <TopBar classes={classes} handleDrawerToggle={handleDrawerToggle} pageTitle={currentRoute.text}/>
          <div className={classes.toolbar}/>
          <Switch>
            {
              routes
                .map((item) =>
                  <Route
                    key={item.id}
                    exact
                    path={item.path}
                    component={item.component}/>
                )
            }
            <Route exact path="/" render={() => (
              <Redirect to="/shoppingList"/>
            )}/>
          </Switch>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
