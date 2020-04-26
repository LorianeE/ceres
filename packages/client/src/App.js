import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme, useStyles } from './style';
import Nav from './structureComponents/Nav';
import TopBar from './structureComponents/TopBar';
import routes from './routes';
import DrawerContent from './structureComponents/DrawerContent';
import useIsOpen from './utils/hooks';
import SigninPage from './welcome/SigninPage';
import LoginUtils from './utils/LoginUtils';

function App() {
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

  const logout = () => {
    LoginUtils.logout();
    setUser(null);
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

export default App;
