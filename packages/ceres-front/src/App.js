import React from 'react';
import {
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import './App.css'
import '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import {ThemeProvider} from '@material-ui/core/styles'
import {useStyles, theme} from './style'
import Nav from './structureComponents/Nav';
import TopBar from './structureComponents/TopBar';
import routes from './routes';
import DrawerContent from "./structureComponents/DrawerContent";
import {useIsOpen} from "./utils/hooks";

function App() {
  const classes = useStyles();
  const [isOpen, toggleIfOpen] = useIsOpen();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline/>
        <Nav open={isOpen} onClose={toggleIfOpen}>
          <DrawerContent onClick={toggleIfOpen}/>
        </Nav>
        <main className={classes.content}>
          <TopBar handleDrawerToggle={toggleIfOpen}/>
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
            <Route render={() => <Redirect to="/shoppinglist"/>}/>
          </Switch>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
