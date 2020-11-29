import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import RestoreIcon from '@material-ui/icons/Restore';
import useStyles from '../shoppingStyle';

const CancelRemoveItemButton = ({ cancelRemoveItem }) => {
  const classes = useStyles();

  return (
    <Button
      variant="contained"
      color="secondary"
      className={classes.button}
      startIcon={<RestoreIcon />}
      onClick={cancelRemoveItem}
      style={{ marginLeft: 16 }}
    >
      Annuler
    </Button>
  );
};

CancelRemoveItemButton.propTypes = {
  cancelRemoveItem: PropTypes.func.isRequired,
};

export default CancelRemoveItemButton;
