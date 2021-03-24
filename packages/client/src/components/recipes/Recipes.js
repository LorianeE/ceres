import React, { useState } from 'react';
import { Fade, Grid, Hidden, Typography } from '@material-ui/core';
import { useStyles } from './recipesStyle';
import Header from './components/RecipesHeader';
import Tags from './components/RecipesHeaderTags';
import RecipesListDesktop from './components/RecipesListDesktop';
import RecipeCard from './components/card/RecipeCard';
import RecipeEdit from './components/edit/RecipeEdit';
import useRecipes from '../../redux/hooks/useRecipes';
import RemoveRecipeDialog from './components/RemoveRecipeDialog';

const Recipes = () => {
  const classes = useStyles();

  const {
    allTags,
    recipes,
    filteredRecipes,
    filteredTags,
    products,
    selectedRecipe,
    setSelectedRecipe,
    selectedIndex,
    searchRecipeTitle,
    handleTagClick,
    handleSearchChange,
    handleSelectRecipe,
    editRecipe,
    removeRecipe,
  } = useRecipes();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedRecipe(null);
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <>
      <Grid container direction="column">
        <Header searchRecipe={searchRecipeTitle} handleSearchChange={handleSearchChange} />
        <Tags allTags={allTags} filteredTags={filteredTags} handleTagClick={handleTagClick} />
        <Grid item container direction="row" xs={12}>
          <Grid item xs={12} md={7} className={`${classes.root} ${classes.paperBackground}`}>
            {recipes.length ? (
              <RecipesListDesktop
                filteredRecipes={filteredRecipes}
                selectedRecipe={selectedRecipe}
                selectedIndex={selectedIndex}
                handleSelectRecipe={handleSelectRecipe}
              />
            ) : (
              <Typography>
                Vous n&apos;avez aucune recette dans votre carnet ! Cliquez sur l&apos;icône « + » ci-dessus pour en ajouter une.
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={5}>
            {selectedRecipe && (
              <div style={{ paddingTop: '0px' }}>
                <Hidden smDown implementation="css" className={classes.root}>
                  <Fade in={!!selectedRecipe}>
                    <RecipeCard selectedRecipe={selectedRecipe} handleEditOpen={handleEditOpen} handleDeleteOpen={handleDeleteOpen} />
                  </Fade>
                </Hidden>
                <RecipeEdit
                  recipeToEdit={selectedRecipe}
                  handleEditClose={handleEditClose}
                  editRecipe={editRecipe}
                  open={editOpen}
                  allTags={allTags}
                  products={products}
                />
              </div>
            )}
          </Grid>
        </Grid>
      </Grid>
      <RemoveRecipeDialog
        recipeId={selectedRecipe?.id}
        deleteOpen={deleteOpen}
        handleDeleteClose={handleDeleteClose}
        removeRecipe={removeRecipe}
      />
    </>
  );
};

export default Recipes;
