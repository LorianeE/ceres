import React, {useState} from 'react'
import {makeStyles} from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AddProductArea from "./AddProductArea";
import ShoppingList from "./ShoppingList";

import shoppingListData from '../data/shoppingList.json'
import CancelRemoveItemButton from "./CancelRemoveItemButton";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 750,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: `${window.innerHeight - 88}px`
  },
  listSection: {
    backgroundColor: 'inherit'
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0
  },
  autoComplete: {
    width: '100%',
    maxWidth: 750,
    marginBottom: 20,
    paddingLeft: 16,
    paddingRight: 16
  }
}));

const Shopping = () => {
  const classes = useStyles();

  const [shoppingMode, setShoppingMode] = useState(false)
  const [itemsRemoved, setItemsRemoved] = useState([])
  const [shoppingList, setShoppingList] = useState(shoppingListData)

  const switchShoppingMode = () => {
    if (shoppingMode) {
      setItemsRemoved([])
    }
    setShoppingMode(!shoppingMode)
  }

  const handleCheckItem = (event) => {
    const removedItem = event.target.id
    setTimeout(() => {
      const newShoppingList = shoppingList.filter(item => item.id !== removedItem)
      const newLastItemRemoved = shoppingList.find(item => item.id === removedItem)
      setShoppingList(newShoppingList)
      setItemsRemoved([...itemsRemoved, newLastItemRemoved])
    }, 200)
  };

  const cancelRemoveItem = () => {
    const newShoppingList = [...shoppingList, itemsRemoved[itemsRemoved.length - 1]]
    const newItemsRemoved = itemsRemoved.slice(0, itemsRemoved.length - 1)
    setShoppingList(newShoppingList)
    setItemsRemoved(newItemsRemoved)
  }


  const changeItemQuantity = (item, quantityToAdd) => {
    let itemToUpdateIndex = shoppingList.findIndex(product => product.id === item.id)
    if (itemToUpdateIndex !== -1) {
      const newQuantity = shoppingList[itemToUpdateIndex].quantity + quantityToAdd
      if (newQuantity > 0) {
        shoppingList[itemToUpdateIndex].quantity = newQuantity
      } else {
        shoppingList.splice(itemToUpdateIndex, 1)
      }
    } else {
      shoppingList.push({
        ...item,
        quantity: quantityToAdd
      })
    }
    const newShoppingList = [...shoppingList]
    setShoppingList(newShoppingList)
  }

  return (
    <div>
      <FormGroup aria-label="position" row style={{marginBottom: 20}}>
        <FormControlLabel
          value="start"
          control={<Switch
            checked={shoppingMode}
            onChange={switchShoppingMode}
            color="primary"
            name="checkedB"
            inputProps={{'aria-label': 'primary checkbox'}}
          />}
          label="Shopping mode !"
          labelPlacement="start"
        />
        {
          itemsRemoved.length >= 1 && <CancelRemoveItemButton classes={classes} cancelRemoveItem={cancelRemoveItem}/>
        }
      </FormGroup>
      {
        !shoppingMode && <AddProductArea classes={classes} addItem={(item) => changeItemQuantity(item, 1)}/>
      }
      <ShoppingList shoppingList={shoppingList} classes={classes} handleCheckItem={handleCheckItem}
                    shoppingMode={shoppingMode} changeItemQuantity={changeItemQuantity}/>
    </div>
  )
};

export default Shopping
