import {makeStyles} from '@material-ui/core/styles';
import {createMuiTheme} from '@material-ui/core/styles';
import lightGreen from '@material-ui/core/colors/lightGreen'

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
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  fitPicture: {
    'padding-left': 50,
    'padding-right': 50,
    'margin-bottom': 10,
    'margin-top': 10,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      'margin-left': 'auto',
      'margin-right': 'auto',
      'margin-top': 20,
      'margin-bottom': 20,
      'padding-left': 0,
      'padding-right': 0,
    },
  }
}));

export const theme = createMuiTheme({
  palette: {
    primary: lightGreen,
  },
});
