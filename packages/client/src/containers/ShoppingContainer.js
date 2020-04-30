import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Box from '@material-ui/core/Box';
import AddProductArea from '../components/shopping/AddProductArea';
import ShoppingList from '../components/shopping/ShoppingList';
import ShoppingHeader from '../components/shopping/ShoppingHeader';
import useShopping from '../utils/ShoppingUtils';
import { createShoppingList } from '../utils/http/ShoppingClient';

const ShoppingContainer = ({ user }) => {
  const [shoppingMode, setShoppingMode] = useState(false);
  const shopping = useShopping(user);
  const {
    shoppingList,
    shelves,
    changeItemQuantity,
    removeAddedItem,
    cancelRemoveItem,
    hasRemovedItems,
    cleanRemovedItems,
    updateShoppingList,
  } = shopping;

  const switchShoppingMode = () => {
    if (shoppingMode) {
      cleanRemovedItems();
    }
    setShoppingMode(!shoppingMode);
  };

  if (!shoppingList) {
    return (
      <div>
        <Typography align="center" variant="body1">
          Vous n&apos;avez pas de liste de courses !
        </Typography>
        <Box m={4} textAlign="center">
          <Button
            variant="contained"
            style={{ backgroundColor: '#f3dc9b' }}
            startIcon={<AddCircleIcon />}
            onClick={() => {
              createShoppingList().then((shopList) => updateShoppingList(shopList.id));
            }}
          >
            En créer une
          </Button>
        </Box>
      </div>
    );
  }
  return (
    <div>
      <ShoppingHeader
        shoppingMode={shoppingMode}
        switchShoppingMode={switchShoppingMode}
        hasRemovedItems={hasRemovedItems}
        cancelRemoveItem={cancelRemoveItem}
      />
      {!shoppingMode && <AddProductArea addItem={(item) => changeItemQuantity(item, 1)} />}
      <ShoppingList
        shoppingList={shoppingList}
        shelves={shelves}
        removeAddedItem={removeAddedItem}
        shoppingMode={shoppingMode}
        changeItemQuantity={changeItemQuantity}
      />
    </div>
  );
};

export default ShoppingContainer;
