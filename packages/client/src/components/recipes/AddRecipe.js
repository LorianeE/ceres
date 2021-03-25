import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Button, Grid, IconButton, InputAdornment, TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import CloseIcon from '@material-ui/icons/Close';
import { useSelector } from 'react-redux';
import EditRecipeTags from './components/edit/EditRecipeTags';
import { getRecipesTags } from '../../redux/selectors/recipes.selectors';
import { useProducts } from '../../redux/hooks/useProducts';
import EditIngredients from './components/edit/EditIngredients';
import useRecipes from '../../redux/hooks/useRecipes';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 850,
  },
  paper: {
    padding: theme.spacing(3),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const AddRecipe = () => {
  const classes = useStyles();
  const history = useHistory();

  const allTags = useSelector(getRecipesTags);
  const { productsSortedByLabel } = useProducts();
  const { addRecipe } = useRecipes();

  const [recipe, setRecipe] = useState({
    id: `temp_${String(Date.now())}`,
    title: '',
    url: '',
    imgUrl: '',
    nbGuests: '',
    tags: [],
    ingredients: [],
  });

  const [fieldsAreDirty, setFieldsAreDirty] = useState({
    title: false,
    url: false,
    imgUrl: false,
    nbGuests: false,
    tags: false,
    ingredients: false,
  });

  const filteredProducts = productsSortedByLabel.filter((product) => {
    return !recipe.ingredients.find((ingredient) => ingredient.product.id === product.id);
  });

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

  const handleDeleteField = (id) => {
    setRecipe({
      ...recipe,
      [id]: '',
    });
  };
  const handleDirty = (e) => {
    setFieldsAreDirty({
      ...fieldsAreDirty,
      [e.target.id]: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addRecipe(recipe);
    history.push('/recipes');
  };

  const isDisabledSubmit = () => !recipe.title.length || !recipe.nbGuests || recipe.nbGuests <= 0 || !recipe.ingredients.length;

  const getEndAdornment = (id) => (
    <InputAdornment position="end">
      <IconButton aria-label="toggle password visibility" onClick={() => handleDeleteField(id)}>
        <CloseIcon />
      </IconButton>
    </InputAdornment>
  );

  return (
    <div className={classes.root}>
      <IconButton
        color="primary"
        aria-label="go back"
        component="span"
        style={{ alignSelf: 'start', marginBottom: '20px' }}
        onClick={() => history.push('/recipes')}
      >
        <ArrowBackIcon />
      </IconButton>
      <Paper className={classes.paper}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
              <TextField
                id="title"
                error={fieldsAreDirty.title && !recipe.title.length}
                name="title"
                variant="outlined"
                required
                fullWidth
                multiline
                label="Titre"
                value={recipe.title}
                onChange={handleChange}
                onBlur={handleDirty}
                InputProps={{ endAdornment: getEndAdornment('title') }}
              />
            </Grid>
            <Grid item xs={8} sm={4}>
              <TextField
                id="nbGuests"
                variant="outlined"
                required
                fullWidth
                label="Personnes"
                type="number"
                error={fieldsAreDirty.nbGuests && (!recipe.nbGuests || recipe.nbGuests <= 0)}
                value={recipe.nbGuests}
                onChange={handleChange}
                onBlur={handleDirty}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="url"
                name="url"
                variant="outlined"
                fullWidth
                label="URL de la recette"
                value={recipe.url}
                onChange={handleChange}
                onBlur={handleDirty}
                InputProps={{ endAdornment: getEndAdornment('url') }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="imgUrl"
                name="imgUrl"
                variant="outlined"
                fullWidth
                label="URL de l'image d'illustration"
                value={recipe.imgUrl}
                onChange={handleChange}
                onBlur={handleDirty}
                InputProps={{ endAdornment: getEndAdornment('imgUrl') }}
              />
            </Grid>
            <Grid item xs={12}>
              <EditRecipeTags
                recipeTags={recipe.tags}
                allTags={allTags}
                handleTagsChange={handleTagsChange}
                controlSize={56}
                placeholderSize={16}
                placeholderColor="rgb(117, 117, 117, 1)"
              />
            </Grid>
            <Grid item xs={12}>
              <EditIngredients
                ingredients={recipe.ingredients}
                products={filteredProducts}
                handleUpdateIngredient={handleUpdateIngredient}
                handleDeleteIngredient={handleDeleteIngredient}
                handleAddIngredient={handleAddIngredient}
                addIngredientContainerStyle={{ border: '1px solid', marginBottom: '20px', borderRadius: '7px', borderColor: '#8bc34a' }}
              />
            </Grid>
            <Grid item container direction="row" justify="center">
              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isDisabledSubmit()}
                  color="primary"
                  className={classes.submit}
                >
                  Sauvegarder
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default AddRecipe;
