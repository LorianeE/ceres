import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import Button from '@material-ui/core/Button';

// eslint-disable-next-line react/prop-types
const RemoveRecipeDialog = ({ recipeId, deleteOpen, handleDeleteClose, removeRecipe }) => {
  const handleDeleteAndClose = () => {
    removeRecipe(recipeId);
    handleDeleteClose();
  };

  return (
    <Dialog open={deleteOpen} onClose={handleDeleteClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">Voulez-vous vraiment supprimer cette recette ?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          La recette sera supprimée de votre carnet de recette. Si vous l&apos;avez partagée avec un autre utilisateur, elle ne sera pas
          supprimée pour lui.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteClose} color="primary" autoFocus>
          Annuler
        </Button>
        <Button onClick={handleDeleteAndClose} color="primary">
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveRecipeDialog;
