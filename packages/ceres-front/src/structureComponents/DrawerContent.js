import React from 'react';
import { Link } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import logo from '../logo.png';
import { useStyles } from '../style';
import menu from '../routes';

const DrawerContent = ({ onClick = (f) => f }) => {
  const classes = useStyles();
  const onClickWithTimeOut = () => {
    setTimeout(onClick, 150);
  };

  return (
    <div>
      <img src={logo} alt="Ceres logo" className={classes.fitPicture} />
      <Divider />
      <List>
        {menu.map(({ id, text, icon, path }) => {
          const ListIconComponent = icon;
          return (
            <ListItem key={id} button onClick={onClickWithTimeOut} component={Link} to={path}>
              <ListItemIcon>
                <ListIconComponent />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default DrawerContent;
