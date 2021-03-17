import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { useStyles } from '../../recipesStyle';

const EditIngredient = ({ ingredient, handleChangeIngredientQuantity, handleDeleteIngredient }) => {
  const classes = useStyles();

  return (
    <Grid container direction="row" justify="space-between" alignItems="center" key={ingredient.id} className={classes.editIngredientsList}>
      <Grid item xs={2} style={{ paddingLeft: '10px', paddingBottom: '8px' }}>
        <TextField
          margin="dense"
          id={`${ingredient.id}_quantity`}
          label="Quantité"
          type="number"
          value={ingredient.quantity}
          style={{ marginTop: '0px' }}
          onChange={(e) => handleChangeIngredientQuantity(e.target.value, ingredient.id)}
        />
      </Grid>
      <Grid item xs={8}>
        <Typography style={{ paddingLeft: '15px' }}>{ingredient.product.label}</Typography>
      </Grid>
      <Grid item xs={2} style={{ textAlign: 'center' }}>
        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteIngredient(ingredient.id)}>
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

EditIngredient.propTypes = {
  ingredient: PropTypes.shape({
    id: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    product: PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  handleChangeIngredientQuantity: PropTypes.func.isRequired,
  handleDeleteIngredient: PropTypes.func.isRequired,
};

export default EditIngredient;
