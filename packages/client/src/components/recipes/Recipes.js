import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import Header from './components/RecipesHeader';
import Tags from './components/RecipesHeaderTags';
import RecipesListDesktop from './components/RecipesListDesktop';
import RecipeEditDialog from './components/edit/RecipeEdit';
import useRecipes from '../../redux/hooks/useRecipes';
import RemoveRecipeDialog from './components/RemoveRecipeDialog';
import useScreenBreakpoints from '../../redux/hooks/useScreenBreakpoints';
import RecipesListMobile from './components/RecipesListMobile';

const Recipes = () => {
  const { isSmOrLower } = useScreenBreakpoints();

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
        {isSmOrLower ? (
          <RecipesListMobile
            filteredRecipes={filteredRecipes}
            handleSelectRecipe={handleSelectRecipe}
            selectedRecipe={selectedRecipe}
            handleEditOpen={handleEditOpen}
            handleDeleteOpen={handleDeleteOpen}
          />
        ) : (
          <RecipesListDesktop
            recipes={recipes}
            filteredRecipes={filteredRecipes}
            selectedRecipe={selectedRecipe}
            selectedIndex={selectedIndex}
            handleSelectRecipe={handleSelectRecipe}
            handleEditOpen={handleEditOpen}
            handleDeleteOpen={handleDeleteOpen}
          />
        )}
      </Grid>
      {selectedRecipe && (
        <RecipeEditDialog
          recipeToEdit={selectedRecipe}
          handleEditClose={handleEditClose}
          editRecipe={editRecipe}
          open={editOpen}
          allTags={allTags}
          products={products}
          fullScreen={isSmOrLower}
        />
      )}

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
