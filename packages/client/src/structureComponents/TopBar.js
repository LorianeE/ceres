import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useLocation } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import routes from '../routes';
import { useStyles } from '../style';

const TopBar = ({ handleDrawerToggle, logout }) => {
  const classes = useStyles();
  const location = useLocation();
  const currentRoute = routes.find((route) => location.pathname === route.path);

  const onClick = () => {
    logout();
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} className={classes.menuButton}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap style={{ color: 'white' }}>
          {currentRoute?.text}
        </Typography>
        <ExitToAppIcon className={classes.logoutButtonMobile} onClick={onClick} />
        <Button color="inherit" className={classes.logoutButtonDesktop} onClick={onClick}>
          <ExitToAppIcon style={{ marginRight: 5 }} />
          Déconnexion
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
