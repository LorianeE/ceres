/* eslint react/prop-types: 0 */
import React from 'react';
import { Avatar, Divider, Fade, Grid, Hidden, ListItemAvatar, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import ListItemText from '@material-ui/core/ListItemText';
import RecipeCard from './card/RecipeCard';
import { useStyles } from '../recipesStyle';

const RecipeList = ({ filteredRecipes = [], selectedRecipe, selectedIndex, handleSelectRecipe }) => {
  return (
    <List>
      {filteredRecipes.map((recipe, index) => {
        return (
          <div key={recipe.id}>
            <ListItem button selected={selectedRecipe && selectedIndex === index} onClick={() => handleSelectRecipe(index, recipe)}>
              <ListItemAvatar>
                <Avatar alt={recipe.title} src={recipe.imgUrl}>
                  <RestaurantIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={recipe.title} />
            </ListItem>
            <Divider component="li" />
          </div>
        );
      })}
    </List>
  );
};

const RecipesListDesktop = ({
  recipes = [],
  filteredRecipes = [],
  selectedRecipe,
  selectedIndex,
  handleSelectRecipe,
  handleEditOpen,
  handleDeleteOpen,
}) => {
  const classes = useStyles();

  return (
    <Grid item container direction="row" xs={12}>
      <Grid item xs={12} md={6} lg={7} className={`${classes.root} ${classes.paperBackground}`}>
        {recipes.length ? (
          <RecipeList
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
      <Grid item xs={12} md={6} lg={5}>
        {selectedRecipe && (
          <div style={{ paddingTop: '0px' }}>
            <Hidden smDown implementation="css" className={classes.root}>
              <Fade in={!!selectedRecipe}>
                <RecipeCard selectedRecipe={selectedRecipe} handleEditOpen={handleEditOpen} handleDeleteOpen={handleDeleteOpen} />
              </Fade>
            </Hidden>
          </div>
        )}
      </Grid>
    </Grid>
  );
};

export default RecipesListDesktop;
