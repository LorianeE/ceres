import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme, useStyles } from './style';
import Nav from './components/common/Nav';
import TopBar from './components/common/TopBar';
import routes from './routes';
import DrawerContent from './components/common/DrawerContent';
import useIsOpen from './redux/hooks/useIsOpen';
import SigninPage from './components/welcome/SigninPage';
import { useInitializeApp } from './redux/hooks/useInitializeApp';

function App() {
  const classes = useStyles();
  const [isOpen, toggleIfOpen] = useIsOpen();

  const { userLoggedIn, fetchUserCallInProgress, logOut } = useInitializeApp();

  if (fetchUserCallInProgress) {
    return <></>;
  }

  return (
    <ThemeProvider theme={theme}>
      {!userLoggedIn ? (
        <SigninPage />
      ) : (
        <div className={classes.root}>
          <CssBaseline />
          <Nav open={isOpen} onClose={toggleIfOpen}>
            <DrawerContent onClick={toggleIfOpen} />
          </Nav>
          <main className={classes.content}>
            <TopBar handleDrawerToggle={toggleIfOpen} logout={logOut} />
            <div className={classes.toolbar} />
            <Switch>
              {routes.map((item) => (
                <Route
                  key={item.id}
                  exact
                  path={item.path}
                  component={() => {
                    const Component = item.component;
                    const { props } = item;
                    return <Component {...props} />;
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
