import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';
import { useStyles } from '../../recipesStyle';

const AddNewIngredient = ({ containerStyle, products, handleAddIngredient, handleCloseNewIngredient }) => {
  const classes = useStyles();

  const ingredientInitialState = { id: `temp_${String(Date.now())}`, product: {}, quantity: '' };

  const [newIngredient, setNewIngredient] = useState(ingredientInitialState);
  const [productToAdd, setProductToAdd] = useState(null);
  const [newProductOnError, setNewProductOnError] = useState(false);
  const [newQuantityOnError, setNewQuantityOnError] = useState(false);

  const onAutocompleteChange = (event, value) => {
    setProductToAdd(value);
  };

  const handleChangeNewIngredient = (e) => {
    setNewIngredient({
      ...newIngredient,
      [e.target.name]: e.target.name === 'quantity' ? parseFloat(e.target.value, 10) : e.target.value,
    });
  };

  const handleAddProductToNewIngredient = () => {
    if (productToAdd) {
      setNewIngredient({
        ...newIngredient,
        product: productToAdd,
      });
    }
  };

  const onAddIngredient = () => {
    setNewProductOnError(false);
    setNewQuantityOnError(false);
    if (!newIngredient.product.id) {
      setNewProductOnError(true);
    }
    if (!newIngredient.quantity || newIngredient.quantity <= 0) {
      setNewQuantityOnError(true);
    }
    if (newIngredient.product.id && newIngredient.quantity && newIngredient.quantity > 0) {
      handleAddIngredient(newIngredient);
      setProductToAdd(null);
      setNewIngredient(ingredientInitialState);
    }
  };

  const onCloseNewIngredient = () => {
    setProductToAdd(null);
    setNewIngredient(ingredientInitialState);
    handleCloseNewIngredient();
  };

  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      className={classes.editIngredientsList}
      style={containerStyle}
    >
      <Grid item xs={2} style={{ paddingLeft: '10px', paddingBottom: '12px' }}>
        <TextField
          id="newIngredient_quantity"
          name="quantity"
          label="Quantité"
          type="number"
          value={newIngredient.quantity}
          error={newQuantityOnError}
          onChange={handleChangeNewIngredient}
        />
      </Grid>
      <Grid item xs={8} style={{ paddingLeft: '10px', paddingBottom: '12px' }}>
        <Autocomplete
          id="combo-box-demo"
          options={products}
          value={productToAdd}
          getOptionLabel={(option) => option.label}
          getOptionSelected={(option, value) => value && option.name === value.name}
          renderInput={(params) => <TextField {...params} error={newProductOnError} label="Produit" />}
          onChange={onAutocompleteChange}
          onBlur={handleAddProductToNewIngredient}
        />
      </Grid>
      <Grid item xs={2} style={{ textAlign: 'center' }}>
        <IconButton edge="end" aria-label="add" onClick={onAddIngredient}>
          <AddCircleIcon />
        </IconButton>
        <IconButton edge="end" aria-label="cancel" onClick={onCloseNewIngredient}>
          <CloseIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

AddNewIngredient.defaultProps = {
  containerStyle: {},
};

AddNewIngredient.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  containerStyle: PropTypes.object,
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleAddIngredient: PropTypes.func.isRequired,
  handleCloseNewIngredient: PropTypes.func.isRequired,
};

export default AddNewIngredient;
