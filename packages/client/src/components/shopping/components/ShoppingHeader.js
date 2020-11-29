import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import CancelRemoveItemButton from './CancelRemoveItemButton';
import useStyles from '../shoppingStyle';

const ShoppingHeader = ({ shoppingMode, switchShoppingMode, hasRemovedItems, cancelRemoveItem }) => {
  const classes = useStyles();

  return (
    <FormGroup aria-label="position" row style={{ marginBottom: 20 }}>
      <FormControlLabel
        value="start"
        control={
          <Switch
            checked={shoppingMode}
            onChange={switchShoppingMode}
            color="primary"
            name="checkedB"
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        }
        label="Shopping mode"
        labelPlacement="start"
      />
      {hasRemovedItems && <CancelRemoveItemButton classes={classes} cancelRemoveItem={cancelRemoveItem} />}
    </FormGroup>
  );
};

ShoppingHeader.propTypes = {
  shoppingMode: PropTypes.bool.isRequired,
  switchShoppingMode: PropTypes.func.isRequired,
  hasRemovedItems: PropTypes.bool.isRequired,
  cancelRemoveItem: PropTypes.func.isRequired,
};

export default ShoppingHeader;
