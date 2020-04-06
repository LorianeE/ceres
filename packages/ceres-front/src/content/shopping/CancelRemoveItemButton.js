import React from "react";
import Button from "@material-ui/core/Button";
import RestoreIcon from "@material-ui/icons/Restore";

const CancelRemoveItemButton = ({classes, cancelRemoveItem}) => {
  return (
    <Button
      variant="contained"
      color="secondary"
      className={classes.button}
      startIcon={<RestoreIcon/>}
      onClick={cancelRemoveItem}
      style={{marginLeft: 16}}
    >
      Annuler
    </Button>
  )
};

export default CancelRemoveItemButton
