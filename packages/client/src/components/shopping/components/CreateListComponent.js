import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const CreateListComponent = ({ createShoppingList }) => {
  return (
    <>
      <Typography align="center" variant="body1" p={2}>
        Vous n&apos;avez pas de liste de courses !
      </Typography>
      <Box m={4} textAlign="center">
        <Button
          variant="contained"
          style={{ backgroundColor: '#f3dc9b' }}
          startIcon={<AddCircleIcon />}
          onClick={() => createShoppingList()}
        >
          En créer une
        </Button>
      </Box>
    </>
  );
};

CreateListComponent.propTypes = {
  createShoppingList: PropTypes.func.isRequired,
};

export default CreateListComponent;
