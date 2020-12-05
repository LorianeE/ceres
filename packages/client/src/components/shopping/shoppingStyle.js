import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 850,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: `${window.innerHeight - 246}px`,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  autoComplete: {
    width: '100%',
    maxWidth: 750,
    marginBottom: 20,
    paddingLeft: 16,
    paddingRight: 16,
  },
}));

export default useStyles;
