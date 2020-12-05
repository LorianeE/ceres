import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    // paddingLeft: theme.spacing(2),
    // paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.dark,
          backgroundColor: lighten(theme.palette.secondary.main, 0.75),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, selectedProducts, deleteProducts, unSelectProducts } = props;

  const onDelete = () => {
    deleteProducts(selectedProducts);
    unSelectProducts();
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} sélectionné(s)
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Gérer mes produits
        </Typography>
      )}

      {numSelected === 1 && (
        <Tooltip title="Modifier">
          <IconButton aria-label="modifier" component={Link} to={`/products/${selectedProducts[0]}/edit`}>
            <CreateIcon />
          </IconButton>
        </Tooltip>
      )}
      {numSelected > 0 && (
        <Tooltip title="Supprimer">
          <IconButton aria-label="supprimer" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selectedProducts: PropTypes.arrayOf(PropTypes.string).isRequired,
  deleteProducts: PropTypes.func.isRequired,
  unSelectProducts: PropTypes.func.isRequired,
};

export default EnhancedTableToolbar;
