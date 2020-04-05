import React, {useState} from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import ListSubheader from '@material-ui/core/ListSubheader';
import {makeStyles} from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RestoreIcon from '@material-ui/icons/Restore';

import shoppingListData from './data/shoppingList.json'

import {SHELF_TRANSLATION} from './data/translation'
import Button from "@material-ui/core/Button";

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
  }
}));

const ShoppingList = () => {
  const classes = useStyles();

  const [shoppingMode, setShoppingMode] = useState(false)
  const [itemsRemoved, setItemsRemoved] = useState([])
  const [shoppingList, setShoppingList] = useState(shoppingListData)

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

  const shelves = Array.from(new Set(shoppingList.map(item => item.shelf))).sort()

  return (
    <div>
      <FormGroup aria-label="position" row style={{marginBottom: 20}}>
        <FormControlLabel
          value="start"
          control={<Switch
            checked={shoppingMode}
            onChange={() => setShoppingMode(!shoppingMode)}
            color="primary"
            name="checkedB"
            inputProps={{'aria-label': 'primary checkbox'}}
          />}
          label="Shopping mode !"
          labelPlacement="start"
        />
        {
          itemsRemoved.length >= 1 && (
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
        }
      </FormGroup>
      <List className={classes.root} subheader={<li/>}>
        {shelves.map((shelf) => (
          <li key={shelf} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader>{SHELF_TRANSLATION[shelf]}</ListSubheader>
              {
                shoppingList.map(({id, label, quantity, shelf: itemShelf}) => {
                  return itemShelf === shelf && (
                    <ListItem key={id} button disableRipple onClick={() => {
                    }} style={{cursor: 'default'}}>
                      {
                        shoppingMode && (
                          <Checkbox
                            edge="start"
                            defaultChecked={false}
                            onChange={handleCheckItem}
                            inputProps={{'aria-labelledby': `list-item-text-${id}`}}
                            id={id}
                          />
                        )
                      }
                      <ListItemIcon style={{minWidth: 25}}>
                        <Typography>
                          {quantity}
                        </Typography>
                      </ListItemIcon>
                      <ListItemText id={`list-item-text-${id}`} primary={label}/>
                    </ListItem>
                  )
                })
              }
            </ul>
          </li>
        ))}
      </List>
    </div>
  )
};

export default ShoppingList
