import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'auto',
    maxHeight: `${window.innerHeight - 246}px`,
    padding: '0px 15px',
    height: '100%',
  },
  paperBackground: {
    backgroundColor: theme.palette.background.paper,
    padding: '10px 15px',
  },
  tag: {
    margin: '5px 5px',
    fontSize: '12px',
    minWidth: '60px',
  },
  actionRecipeCardButton: {
    backgroundColor: 'rgba(228, 228, 228, 0.7)',
    '&:hover': {
      backgroundColor: 'rgba(228, 228, 228, 0.9)',
    },
    color: 'black',
  },
  editIngredientsList: {
    '&:hover': {
      backgroundColor: '#e9e9e9',
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));
