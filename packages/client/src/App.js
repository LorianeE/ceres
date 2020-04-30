import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { theme, useStyles } from './style';
import Nav from './components/structureComponents/Nav';
import TopBar from './components/structureComponents/TopBar';
import routes from './routes';
import DrawerContent from './components/structureComponents/DrawerContent';
import useIsOpen from './utils/hooks';
import SigninPage from './components/welcome/SigninPage';
import LoginUtils from './utils/LoginUtils';
import { fetchDBProductsList } from './actions/productsAction';

function App({ dispatch }) {
  const classes = useStyles();
  const [isOpen, toggleIfOpen] = useIsOpen();
  const [user, setUser] = useState(null);

  useEffect(() => {
    LoginUtils.isUserLoggedIn().then((u) => {
      if (u) {
        setUser(u);
      } else {
        setUser({});
      }
    });
  }, []);

  useEffect(() => {
    dispatch(fetchDBProductsList());
  }, [dispatch]);

  const logout = () => {
    LoginUtils.logout();
    setUser({});
  };

  return (
    <ThemeProvider theme={theme}>
      {user !== null && Object.keys(user).length === 0 && <SigninPage />}
      {user && Object.keys(user).length > 0 && (
        <div className={classes.root}>
          <CssBaseline />
          <Nav open={isOpen} onClose={toggleIfOpen}>
            <DrawerContent onClick={toggleIfOpen} />
          </Nav>
          <main className={classes.content}>
            <TopBar handleDrawerToggle={toggleIfOpen} logout={logout} />
            <div className={classes.toolbar} />
            <Switch>
              {routes.map((item) => (
                <Route
                  key={item.id}
                  exact
                  path={item.path}
                  component={() => {
                    const Component = item.component;
                    return <Component user={user} />;
                  }}
                />
              ))}
              <Route render={() => <Redirect to="/shoppinglist" />} />
            </Switch>
          </main>
        </div>
      )}
    </ThemeProvider>
  );
}

export default connect()(App);
