import React, {useState} from 'react'
import AddProductArea from "./AddProductArea";
import ShoppingList from "./ShoppingList";
import ShoppingHeader from "./ShoppingHeader";
import useShopping from "./ShoppingUtils";

const ShoppingContainer = () => {

  const [shoppingMode, setShoppingMode] = useState(false);
  const shopping = useShopping();
  const {
    shoppingList,
    shelves,
    changeItemQuantity,
    removeAddedItem,
    cancelRemoveItem,
    hasRemovedItems,
    cleanRemovedItems
  } = shopping;

  const switchShoppingMode = () => {
    if (shoppingMode) {
      cleanRemovedItems()
    }
    setShoppingMode(!shoppingMode)
  };

  return (
    <div>
      <ShoppingHeader
        shoppingMode={shoppingMode}
        switchShoppingMode={switchShoppingMode}
        hasRemovedItems={hasRemovedItems}
        cancelRemoveItem={cancelRemoveItem}/>
      {
        !shoppingMode && <AddProductArea addItem={(item) => changeItemQuantity(item, 1)}/>
      }
      <ShoppingList
        shoppingList={shoppingList}
        shelves={shelves}
        removeAddedItem={removeAddedItem}
        shoppingMode={shoppingMode}
        changeItemQuantity={changeItemQuantity}
      />
    </div>
  )
};

export default ShoppingContainer
