import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import ShoppingContainer from "./shopping/ShoppingContainer";
import KitchenIcon from "@material-ui/icons/Kitchen";
import Store from "./store/Store";
import RestaurantMenuIcon from "@material-ui/icons/RestaurantMenu";
import Menu from "./menu/Menu";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import Recipes from "./recipes/Recipes";

const routes = [
  {
    id: 1,
    text: 'Liste de courses',
    icon: ShoppingCartIcon,
    path: '/shoppinglist',
    component: ShoppingContainer
  },
  {
    id: 2,
    text: 'Réserve',
    icon: KitchenIcon,
    path: '/store',
    component: Store
  },
  {
    id: 3,
    text: 'Menu',
    icon: RestaurantMenuIcon,
    path: '/menu',
    component: Menu
  },
  {
    id: 4,
    text: 'Recettes',
    icon: MenuBookIcon,
    path: '/recipes',
    component: Recipes
  }
];


export default routes
