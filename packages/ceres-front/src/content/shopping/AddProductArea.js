import React from "react";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {productsList} from "../data/productsList";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

const AddProductArea = ({ addItem, classes }) => {
  return (
    <Grid container direction="row" alignItems="center" spacing={2} className={classes.autoComplete}>
      <Grid item xs={11}>
        <Autocomplete
          id="combo-box-demo"
          options={productsList}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => <TextField {...params} label="Produit à ajouter" variant="outlined"/>}
        />
      </Grid>
      <Grid item xs={1}>
        <Fab color="primary" aria-label="add" className={classes.margin} size="small" onClick={addItem}>
          <AddIcon/>
        </Fab>
      </Grid>
    </Grid>
  )
};

export default AddProductArea
