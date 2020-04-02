import React from 'react'
import './App.css'
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import KitchenIcon from '@material-ui/icons/Kitchen'
import MenuBookIcon from '@material-ui/icons/MenuBook';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import { ThemeProvider } from '@material-ui/core/styles'
import { useStyles, theme } from './style'
import logo from './logo.png'

function App () {
  const classes = useStyles()

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline/>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
          anchor="left"
        >
          <img src={logo}
               alt="Ceres logo" className={classes.fitPicture}/>
          <Divider/>
          <List>
              <ListItem button key="Liste de courses">
                <ListItemIcon><ShoppingCartIcon/></ListItemIcon>
                <ListItemText primary="Liste de courses"/>
              </ListItem>
            <ListItem button key="Réserve">
              <ListItemIcon><KitchenIcon/></ListItemIcon>
              <ListItemText primary="Réserve"/>
            </ListItem>
            <ListItem button key="Menu">
              <ListItemIcon><RestaurantMenuIcon/></ListItemIcon>
              <ListItemText primary="Menu"/>
            </ListItem>
            <ListItem button key="Recettes">
              <ListItemIcon><MenuBookIcon/></ListItemIcon>
              <ListItemText primary="Recettes"/>
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <Typography variant="h6" noWrap>
                Liste de courses
              </Typography>
            </Toolbar>
          </AppBar>
          <div className={classes.toolbar}/>
          <Typography paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
            facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
            gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
            donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
            adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
            Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
            imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
            arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
            donec massa sapien faucibus et molestie ac.
          </Typography>
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
