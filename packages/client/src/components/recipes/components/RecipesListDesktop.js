import React from 'react';
import { Avatar, Divider, ListItemAvatar } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import ListItemText from '@material-ui/core/ListItemText';

// eslint-disable-next-line react/prop-types
const RecipesListDesktop = ({ filteredRecipes = [], selectedRecipe, selectedIndex, handleSelectRecipe }) => {
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

export default RecipesListDesktop;
