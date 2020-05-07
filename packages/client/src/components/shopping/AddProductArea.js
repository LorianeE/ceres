import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import useStyles from './shoppingStyle';

const AddProductArea = ({ addItem, products }) => {
  const classes = useStyles();

  const [productToAdd, setProductToAdd] = useState(null);

  const onAutocompleteChange = (event, value) => {
    setProductToAdd(value);
  };

  const onClick = () => {
    if (productToAdd) {
      setProductToAdd(null);
      addItem({
        product: productToAdd,
      });
    }
  };

  return (
    <Grid container direction="row" alignItems="center" spacing={2} className={classes.autoComplete}>
      <Grid item xs={11}>
        <Autocomplete
          id="combo-box-demo"
          options={products}
          value={productToAdd}
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

AddProductArea.propTypes = {
  addItem: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AddProductArea;
