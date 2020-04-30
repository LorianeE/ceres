import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import useStyles from './shoppingStyle';

const AddProductArea = ({ addItem, products }) => {
  const classes = useStyles();

  const [itemToAdd, setItemToAdd] = useState(null);

  const onAutocompleteChange = (event, value) => {
    setItemToAdd(value);
  };

  const onClick = () => {
    if (itemToAdd) {
      setItemToAdd(null);
      addItem({
        product: itemToAdd,
      });
    }
  };

  return (
    <Grid container direction="row" alignItems="center" spacing={2} className={classes.autoComplete}>
      <Grid item xs={11}>
        <Autocomplete
          id="combo-box-demo"
          options={products}
          value={itemToAdd}
          getOptionLabel={(option) => option.label}
          getOptionSelected={(option, value) => value && option.name === value.name}
          renderInput={(params) => <TextField {...params} label="Produit à ajouter" variant="outlined" />}
          onChange={onAutocompleteChange}
        />
      </Grid>
      <Grid item xs={1}>
        <Fab color="primary" aria-label="add" size="small" onClick={onClick}>
          <AddIcon />
        </Fab>
      </Grid>
    </Grid>
  );
};

export default AddProductArea;
