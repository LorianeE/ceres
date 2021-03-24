import React from 'react';
import { CardMedia, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import { useStyles } from '../../recipesStyle';

const RecipeCardHeader = ({ selectedRecipe, handleEditOpen, handleDeleteOpen }) => {
  const classes = useStyles();

  return (
    <div style={selectedRecipe.imgUrl ? { position: 'relative' } : { position: 'relative', marginBottom: '60px' }}>
      {selectedRecipe.imgUrl && (
        <CardMedia
          component="img"
          className={classes.media}
          alt={selectedRecipe.title}
          height="140"
          image={selectedRecipe.imgUrl}
          title={selectedRecipe.title}
        />
      )}
      <div style={{ position: 'absolute', top: 8, right: 10 }}>
        <IconButton aria-label="editRecipe" className={classes.actionRecipeCardButton} onClick={handleEditOpen}>
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="deleteRecipe"
          className={classes.actionRecipeCardButton}
          style={{ marginLeft: '8px' }}
          onClick={handleDeleteOpen}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
};

RecipeCardHeader.propTypes = {
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
};

export default RecipeCardHeader;
