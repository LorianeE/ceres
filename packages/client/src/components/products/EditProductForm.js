import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { IconButton } from '@material-ui/core';
import { useEditProductForm } from '../../redux/hooks/useEditProductForm';
import { SHELF_TYPES, SHELF_TYPES_ARRAY } from '../../data/shelf_types';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    maxWidth: '600px',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const EditProductForm = () => {
  const classes = useStyles();
  const history = useHistory();

  const { product, addProduct, editProduct } = useEditProductForm();

  const [isLabelDirty, setIsLabelDirty] = useState(false);
  const [isShelfDirty, setIsShelfDirty] = useState(false);

  const getLabelDirty = () => {
    if (!isLabelDirty) {
      setIsLabelDirty(true);
    }
  };
  const getShelfDirty = () => {
    if (!isShelfDirty) {
      setIsShelfDirty(true);
    }
  };

  const [label, setLabel] = useState('');
  const changeLabel = (e) => {
    getLabelDirty();
    setLabel(e.target.value);
  };
  const [shelf, setShelf] = useState('');
  const changeShelf = (e) => {
    getShelfDirty();
    setShelf(e.target.value);
  };
  const [minimumQuantity, setMinimumQuantity] = useState(0);
  const changeMinQuantity = (e) => setMinimumQuantity(e.target.value);

  const onMinQuantityBlur = () => {
    if (!minimumQuantity || minimumQuantity < 0) {
      setMinimumQuantity(0);
    }
  };

  useEffect(() => {
    if (product) {
      setLabel(product.label);
      setShelf(product.shelf);
      setMinimumQuantity(product.minimumQuantity);
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      ...product,
      label,
      shelf,
      minimumQuantity,
    };
    if (product) {
      editProduct(newProduct);
    } else {
      addProduct(newProduct);
    }
    history.push('/products');
  };

  const isDisabledSubmit = () => !label.length || minimumQuantity < 0 || !shelf.length;

  return (
    <div className={classes.paper}>
      <IconButton
        color="primary"
        aria-label="upload picture"
        component="span"
        style={{ alignSelf: 'start' }}
        onClick={() => history.push('/products')}
      >
        <ArrowBackIcon />
      </IconButton>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              error={isLabelDirty && !label.length}
              name="label"
              variant="outlined"
              required
              fullWidth
              id="label"
              label="Label"
              value={label}
              onChange={changeLabel}
              onBlur={getLabelDirty}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth error={isShelfDirty && !shelf.length}>
              <InputLabel id="shelf-label">Rayon</InputLabel>
              <Select labelId="shelf-label" id="shelf" value={shelf} onChange={changeShelf} onBlur={getShelfDirty} label="Rayon">
                {SHELF_TYPES_ARRAY.map((type) => (
                  <MenuItem value={type} key={type}>
                    {SHELF_TYPES[type]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={8}>
              <Typography>Quantité minimale à avoir en stock :</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="minimumQuantity"
                type="number"
                variant="outlined"
                value={minimumQuantity}
                inputProps={{ style: { textAlign: 'center' } }}
                onChange={changeMinQuantity}
                onBlur={onMinQuantityBlur}
                style={{ width: '100%' }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" disabled={isDisabledSubmit()} color="primary" className={classes.submit}>
          Sauvegarder
        </Button>
      </form>
    </div>
  );
};

export default EditProductForm;
