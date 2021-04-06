import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Grid, Typography } from '@material-ui/core';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RecipeCard from './card/RecipeCard';

// eslint-disable-next-line react/prop-types
const RecipesListMobile = ({ filteredRecipes = [], handleEditOpen, handleDeleteOpen, handleSelectRecipe }) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onOpen = (fn) => () => {
    setExpanded(false);
    fn();
  };

  console.log('filteredRecipes');
  console.log(filteredRecipes);

  return (
    <Grid container spacing={1}>
      {filteredRecipes.map((recipe, index) => {
        return (
          <Grid item xs={12} key={recipe.id} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
            <Accordion expanded={expanded === recipe.id} onChange={handleChange(recipe.id)}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                IconButtonProps={{ style: { paddingLeft: '5px', paddingRight: '10px' } }}
                style={{ paddingLeft: '8px', paddingRight: '8px' }}
                onClick={() => handleSelectRecipe(index, recipe)}
              >
                <Grid container wrap="nowrap" alignItems="center">
                  <Grid item style={{ paddingRight: '10px' }}>
                    <Avatar alt={recipe.title} src={recipe.imgUrl}>
                      <RestaurantIcon />
                    </Avatar>
                  </Grid>
                  <Grid item xs>
                    <Typography>{recipe.title}</Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails style={{ padding: '0px' }}>
                <RecipeCard
                  selectedRecipe={recipe}
                  handleEditOpen={onOpen(handleEditOpen)}
                  handleDeleteOpen={onOpen(handleDeleteOpen)}
                  isMobile
                />
              </AccordionDetails>
            </Accordion>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default RecipesListMobile;
