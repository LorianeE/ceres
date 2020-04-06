import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {productsList} from "../data/productsList";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

const AddProductArea = ({ addItem, classes }) => {

  const [itemToAdd, setItemToAdd] = useState(null);

  const onAutocompleteChange = (event, value) => {
      setItemToAdd(value)
  };

  return (
    <Grid container direction="row" alignItems="center" spacing={2} className={classes.autoComplete}>
      <Grid item xs={11}>
        <Autocomplete
          id="combo-box-demo"
          options={productsList}
          value={itemToAdd}
          getOptionLabel={(option) => option.label}
          getOptionSelected={(option, value) => value && option.name === value.name}
          renderInput={(params) => <TextField {...params} label="Produit à ajouter" variant="outlined" />}
          onChange={onAutocompleteChange}
        />
      </Grid>
      <Grid item xs={1}>
        <Fab color="primary" aria-label="add" size="small" onClick={() => {
          if (itemToAdd) {
            setItemToAdd(null)
            addItem(itemToAdd)
          }
        }}>
          <AddIcon/>
        </Fab>
      </Grid>
    </Grid>
  )
};

export default AddProductArea
