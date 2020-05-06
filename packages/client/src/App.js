import React, { useEffect } from 'react';
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
import { getUserInfo, logOut } from './redux/actions/userAction';

// eslint-disable-next-line no-shadow
function App({ userLoggedIn, getUserInfo, logOut }) {
  const classes = useStyles();
  const [isOpen, toggleIfOpen] = useIsOpen();

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

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
                    return <Component />;
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

function mapStateToProps(state) {
  return {
    userLoggedIn: state.user.isLoggedIn,
  };
}

const mapDispatchToProps = {
  getUserInfo,
  logOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
