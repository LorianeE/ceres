import React, { useState } from 'react';
import { Fade, Grid, Hidden } from '@material-ui/core';
import { useStyles } from './recipesStyle';
import Header from './components/RecipesHeader';
import Tags from './components/RecipesHeaderTags';
import RecipesListDesktop from './components/RecipesListDesktop';
import RecipeCard from './components/card/RecipeCard';
import RecipeEdit from './components/edit/RecipeEdit';
import useRecipes from '../../redux/hooks/useRecipes';

const Recipes = () => {
  const classes = useStyles();

  const {
    allTags,
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
  } = useRecipes();

  const [open, setOpen] = useState(false);

  const handleEditOpen = () => {
    setOpen(true);
  };

  const handleEditClose = () => {
    setOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <Grid container direction="column">
      <Header searchRecipe={searchRecipeTitle} handleSearchChange={handleSearchChange} />
      <Tags allTags={allTags} filteredTags={filteredTags} handleTagClick={handleTagClick} />
      <Grid item container direction="row" xs={12}>
        <Grid item xs={12} md={7} className={`${classes.root} ${classes.paperBackground}`}>
          <RecipesListDesktop
            filteredRecipes={filteredRecipes}
            selectedRecipe={selectedRecipe}
            selectedIndex={selectedIndex}
            handleSelectRecipe={handleSelectRecipe}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          {selectedRecipe && (
            <div style={{ paddingTop: '0px' }}>
              <Hidden smDown implementation="css" className={classes.root}>
                <Fade in={!!selectedRecipe}>
                  <RecipeCard selectedRecipe={selectedRecipe} handleEditOpen={handleEditOpen} />
                </Fade>
              </Hidden>
              <RecipeEdit
                recipeToEdit={selectedRecipe}
                handleEditClose={handleEditClose}
                open={open}
                allTags={allTags}
                products={products}
              />
            </div>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Recipes;
