import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const CreateStoreComponent = ({ createStore }) => {
  return (
    <>
      <Typography align="center" variant="body1" p={2}>
        Vous n&apos;avez pas encore de réserve pour gérer vos stocks !
      </Typography>
      <Box m={4} textAlign="center">
        <Button variant="contained" style={{ backgroundColor: '#f3dc9b' }} startIcon={<AddCircleIcon />} onClick={() => createStore()}>
          En créer une
        </Button>
      </Box>
    </>
  );
};

CreateStoreComponent.propTypes = {
  createStore: PropTypes.func.isRequired,
};

export default CreateStoreComponent;
