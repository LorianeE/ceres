import React from 'react';
import PropTypes from 'prop-types';
import { DialogTitle, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useStyles } from '../../recipesStyle';

const EditRecipeDialogTitle = ({ title, handleChangeTitle, handleEditClose }) => {
  const classes = useStyles();

  return (
    <DialogTitle id="form-dialog-title">
      <TextField
        autoFocus
        margin="dense"
        id="title"
        label="Titre"
        value={title}
        onChange={handleChangeTitle}
        type="text"
        fullWidth
        style={{ paddingRight: '40px' }}
        inputProps={{ style: { fontWeight: 500, fontSize: '1.25rem' } }}
        InputLabelProps={{ style: { fontWeight: 500 } }}
      />
      <IconButton aria-label="close" className={classes.closeButton} onClick={handleEditClose}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
};

EditRecipeDialogTitle.defaultProps = {
  title: '',
};

EditRecipeDialogTitle.propTypes = {
  title: PropTypes.string,
  handleChangeTitle: PropTypes.func.isRequired,
  handleEditClose: PropTypes.func.isRequired,
};

export default EditRecipeDialogTitle;
