import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const EditIngredientsTitle = ({ addIngredient, setAddIngredient }) => {
  return (
    <Grid container justify="space-between" alignItems="center" style={{ margin: '30px 0px 15px 0px' }}>
      <Grid item>
        <Typography variant="subtitle1" style={{ fontWeight: 500 }}>
          Ingredients :
        </Typography>
      </Grid>
      {!addIngredient && (
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<AddCircleIcon />}
            style={{ paddingRight: '5px' }}
            onClick={() => setAddIngredient(true)}
          >
            Ajouter
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

EditIngredientsTitle.propTypes = {
  addIngredient: PropTypes.bool.isRequired,
  setAddIngredient: PropTypes.func.isRequired,
};

export default EditIngredientsTitle;
