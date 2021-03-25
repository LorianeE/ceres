import React from 'react';
import { Card } from '@material-ui/core';
import PropTypes from 'prop-types';
import RecipeCardHeader from './RecipeCardHeader';
import RecipeCardContent from './RecipeCardContent';

const RecipeCard = ({ selectedRecipe, handleEditOpen, handleDeleteOpen, isMobile }) => {
  return (
    <Card>
      <RecipeCardHeader
        selectedRecipe={selectedRecipe}
        handleEditOpen={handleEditOpen}
        handleDeleteOpen={handleDeleteOpen}
        isMobile={isMobile}
      />
      <RecipeCardContent selectedRecipe={selectedRecipe} isMobile={isMobile} />
    </Card>
  );
};

RecipeCard.defaultProps = {
  isMobile: false,
};

RecipeCard.propTypes = {
  selectedRecipe: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    ingredients: PropTypes.arrayOf(PropTypes.object),
    tags: PropTypes.arrayOf(PropTypes.string),
    imgUrl: PropTypes.string,
    url: PropTypes.string,
    nbGuests: PropTypes.number,
  }).isRequired,
  handleEditOpen: PropTypes.func.isRequired,
  handleDeleteOpen: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
};

export default RecipeCard;
