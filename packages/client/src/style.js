import { makeStyles, createMuiTheme } from '@material-ui/core/styles';

import lightGreen from '@material-ui/core/colors/lightGreen';

const drawerWidth = 240;

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px) !important`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none !important',
    },
  },
  logoutButtonDesktop: {
    marginLeft: 'auto',
    display: 'none !important',
    [theme.breakpoints.up('sm')]: {
      display: 'inline-flex !important',
      marginLeft: 'auto',
    },
  },
  logoutButtonMobile: {
    marginLeft: 'auto',
    display: 'inline-flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none !important',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
    width: '100%',
  },
  fitPicture: {
    'padding-left': 25,
    'padding-right': 25,
    'margin-bottom': 10,
    'margin-top': 10,
    [theme.breakpoints.up('sm')]: {
      'margin-left': 'auto',
      'margin-right': 'auto',
      'margin-top': 20,
      'margin-bottom': 20,
      'padding-left': 0,
      'padding-right': 0,
    },
  },
}));

export const theme = createMuiTheme({
  palette: {
    primary: lightGreen,
  },
});
