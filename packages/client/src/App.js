import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import './App.css';
import '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { theme, useStyles } from './style';
import Nav from './components/common/Nav';
import TopBar from './components/common/TopBar';
import routes from './routes';
import DrawerContent from './components/common/DrawerContent';
import useIsOpen from './utils/hooks';
import SigninPage from './components/welcome/SigninPage';
import { getUserInfo, logOut } from './redux/actions/userAction';

// eslint-disable-next-line no-shadow
function App({ userLoggedIn, getUserInfo, logOut, fetchUserCallInProgress }) {
  const classes = useStyles();
  const [isOpen, toggleIfOpen] = useIsOpen();

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

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

App.propTypes = {
  userLoggedIn: PropTypes.bool.isRequired,
  getUserInfo: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired,
  fetchUserCallInProgress: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    userLoggedIn: state.user.isLoggedIn,
    fetchUserCallInProgress: state.apiCallsInProgress.fetchUserCallInProgress,
  };
}

const mapDispatchToProps = {
  getUserInfo,
  logOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
