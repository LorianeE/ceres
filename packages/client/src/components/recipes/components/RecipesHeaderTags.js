import React from 'react';
import { Chip, Grid } from '@material-ui/core';
import { useStyles } from '../recipesStyle';

// eslint-disable-next-line react/prop-types
const Tags = ({ allTags = [], filteredTags = [], handleTagClick }) => {
  const classes = useStyles();
  return (
    <Grid item xs={12} md={7} style={{ paddingBottom: '15px' }}>
      {allTags.map((tag) => {
        return (
          <Chip
            label={tag}
            key={tag}
            className={classes.tag}
            color={filteredTags.includes(tag) ? 'primary' : 'default'}
            onClick={() => handleTagClick(tag)}
          />
        );
      })}
    </Grid>
  );
};

export default Tags;
