import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import AddProductArea from './AddProductArea';
import ShoppingList from './ShoppingList';
import ShoppingHeader from './ShoppingHeader';
import useShopping from '../utils/ShoppingUtils';

const ShoppingContainer = ({ user }) => {
  const [shoppingMode, setShoppingMode] = useState(false);
  const shopping = useShopping(user);
  const { shoppingList, shelves, changeItemQuantity, removeAddedItem, cancelRemoveItem, hasRemovedItems, cleanRemovedItems } = shopping;

  const switchShoppingMode = () => {
    if (shoppingMode) {
      cleanRemovedItems();
    }
    setShoppingMode(!shoppingMode);
  };

  return (
    <div>
      {shoppingList.length > 0 && (
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
      )}
      {shoppingList.length === 0 && <Typography>Vous n&apos;avez pas de liste de courses !</Typography>}
    </div>
  );
};

export default ShoppingContainer;
