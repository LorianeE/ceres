import React from 'react';
import { Fab, Grid, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';

// eslint-disable-next-line react/prop-types
const Header = ({ searchRecipe, handleSearchChange }) => {
  return (
    <Grid item xs={12} md={7} container direction="row" justify="space-between" alignItems="center" style={{ paddingBottom: '20px' }}>
      <Grid item xs={10} md={8} container spacing={1} alignItems="flex-end">
        <Grid item>
          <SearchIcon />
        </Grid>
        <Grid item xs>
          <TextField id="input-with-icon-grid" label="Rechercher" value={searchRecipe} onChange={handleSearchChange} fullWidth />
        </Grid>
      </Grid>
      <Grid item xs={2} md={4} align="right">
        <Fab color="primary" aria-label="add" size="small">
          <AddIcon />
        </Fab>
      </Grid>
    </Grid>
  );
};

export default Header;
