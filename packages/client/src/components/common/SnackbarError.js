import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

const SnackbarError = ({ error, onClose }) => {
  const [open, setOpen] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();

    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
      <Alert severity="error" onClose={handleClose}>
        {error}
      </Alert>
    </Snackbar>
  );
};

SnackbarError.defaultProps = {
  error: 'Une erreur est survenue.',
  onClose: () => {},
};

SnackbarError.propTypes = {
  error: PropTypes.string,
  onClose: PropTypes.func,
};

export default SnackbarError;
