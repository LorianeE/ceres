import React from 'react';
import { CardContent, Chip, Grid, IconButton, Link } from '@material-ui/core';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import AttachmentIcon from '@material-ui/icons/Attachment';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useStyles } from '../../recipesStyle';

const RecipeCardContent = ({ selectedRecipe, isMobile }) => {
  const classes = useStyles();
  console.log('here :', selectedRecipe);
  return (
    <CardContent>
      <Grid container justify="space-between" alignItems="center">
        <Grid item xs={8}>
          <Typography variant={isMobile ? 'body1' : 'h5'} component="h2" style={{ display: 'flex', alignItems: 'center' }}>
            {selectedRecipe.title}
            {selectedRecipe.url && (
              <IconButton aria-label="linkToRecipe" component={Link} href={selectedRecipe.url} target="_blank">
                <AttachmentIcon />
              </IconButton>
            )}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', fontSize: '20px' }}>
            {selectedRecipe.nbGuests} <RestaurantIcon />
          </div>
        </Grid>
      </Grid>
      <div style={{ padding: '15px 0px' }}>
        {selectedRecipe.tags.map((tag) => {
          return <Chip label={tag} key={tag} className={classes.tag} color="primary" />;
        })}
      </div>
      <Typography gutterBottom variant="subtitle1" component="h3" style={{ fontWeight: 500 }}>
        Ingredients
      </Typography>
      <List>
        <Grid container direction="row">
          {selectedRecipe.ingredients.map((ingredient) => (
            <Grid item xs={12} lg={6} key={`${selectedRecipe.id}_${ingredient.id}`}>
              <ListItem dense>
                <ListItemText primary={`${ingredient.quantity}     ${ingredient.product.label}`} />
              </ListItem>
            </Grid>
          ))}
        </Grid>
      </List>
    </CardContent>
  );
};

RecipeCardContent.defaultProps = {
  isMobile: false,
};

RecipeCardContent.propTypes = {
  selectedRecipe: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    ingredients: PropTypes.arrayOf(PropTypes.object),
    tags: PropTypes.arrayOf(PropTypes.string),
    imgUrl: PropTypes.string,
    url: PropTypes.string,
    nbGuests: PropTypes.number,
  }).isRequired,
  isMobile: PropTypes.bool,
};

export default RecipeCardContent;
