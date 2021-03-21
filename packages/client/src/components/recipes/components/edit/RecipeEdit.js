import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, Divider, Grid, TextField, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import EditRecipeTags from './EditRecipeTags';
import EditRecipeDialogTitle from './EditRecipeDialogTitle';
import EditIngredients from './EditIngredients';

const RecipeEdit = ({ recipeToEdit, handleEditClose, open, allTags, products }) => {
  const [recipe, setRecipe] = useState(recipeToEdit);

  const handleChange = (e) => {
    setRecipe({
      ...recipe,
      [e.target.id]: e.target.value,
    });
  };

  const handleTagsChange = (tags) => {
    setRecipe({
      ...recipe,
      tags,
    });
  };

  const handleUpdateIngredient = (updatedIngredients) => {
    setRecipe({
      ...recipe,
      ingredients: updatedIngredients,
    });
  };

  const handleAddIngredient = (newIngredient) => {
    setRecipe({
      ...recipe,
      ingredients: [newIngredient, ...recipe.ingredients],
    });
  };

  const handleDeleteIngredient = (id) => {
    setRecipe({
      ...recipe,
      ingredients: recipe.ingredients.filter((ingredient) => ingredient.id !== id),
    });
  };

  const saveRecipe = () => {
    console.log(recipe);
    handleEditClose();
  };

  return (
    <Dialog open={open} fullWidth scroll="paper" onClose={handleEditClose} disableBackdropClick aria-labelledby="form-dialog-title">
      <EditRecipeDialogTitle title={recipe.title} handleEditClose={handleEditClose} handleChangeTitle={handleChange} />
      <Divider />
      <DialogContent>
        <Grid container justify="space-between" alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              margin="normal"
              id="nbGuests"
              label="Nombre de personnes"
              type="number"
              value={recipe.nbGuests}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {recipe.imgUrl && (
            <Grid item xs={12} md={5} style={{ textAlign: 'center', marginTop: '10px' }}>
              <Typography variant="subtitle2" style={{ marginBottom: '5px' }}>
                Image d&#39;illustration :
              </Typography>
              <img alt={recipe.title} src={recipe.imgUrl} style={{ maxHeight: '100px', borderRadius: '8px' }} />
            </Grid>
          )}
        </Grid>

        <TextField
          margin="normal"
          id="imgUrl"
          label="Url de l'image d'illustration"
          type="url"
          fullWidth
          value={recipe.imgUrl}
          onChange={handleChange}
        />

        <TextField margin="normal" id="url" label="Url de la recette" type="url" fullWidth value={recipe.url} onChange={handleChange} />

        <Typography variant="subtitle1" style={{ margin: '20px 0px 15px 0px', fontWeight: 500 }}>
          Tags :
        </Typography>
        <EditRecipeTags recipeTags={recipe.tags} allTags={allTags} handleTagsChange={handleTagsChange} />

        <EditIngredients
          ingredients={recipe.ingredients}
          products={products}
          handleUpdateIngredient={handleUpdateIngredient}
          handleDeleteIngredient={handleDeleteIngredient}
          handleAddIngredient={handleAddIngredient}
          addIngredientContainerStyle={{ border: '1px solid', marginBottom: '20px', borderRadius: '7px', borderColor: '#8bc34a' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditClose} color="primary">
          Annuler
        </Button>
        <Button onClick={saveRecipe} color="primary">
          Sauvegarder
        </Button>
      </DialogActions>
    </Dialog>
  );
};

RecipeEdit.propTypes = {
  recipeToEdit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    ingredients: PropTypes.arrayOf(PropTypes.object),
    tags: PropTypes.arrayOf(PropTypes.string),
    imgUrl: PropTypes.string,
    url: PropTypes.string,
    nbGuests: PropTypes.number,
  }).isRequired,
  handleEditClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  allTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default RecipeEdit;
