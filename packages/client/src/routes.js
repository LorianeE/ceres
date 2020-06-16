import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import KitchenIcon from '@material-ui/icons/Kitchen';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PersonIcon from '@material-ui/icons/Person';
import ShoppingContainer from './components/shopping/ShoppingContainer';
import Store from './components/store/Store';
import Menu from './components/menu/Menu';
import Recipes from './components/recipes/Recipes';
import ProductsContainer from './components/products/ProductsContainer';

const routes = [
  {
    id: 1,
    text: 'Liste de courses',
    icon: ShoppingCartIcon,
    path: '/shoppinglist',
    component: ShoppingContainer,
  },
  {
    id: 2,
    text: 'Réserve',
    icon: KitchenIcon,
    path: '/store',
    component: Store,
  },
  {
    id: 3,
    text: 'Menu',
    icon: RestaurantMenuIcon,
    path: '/menu',
    component: Menu,
  },
  {
    id: 4,
    text: 'Recettes',
    icon: MenuBookIcon,
    path: '/recipes',
    component: Recipes,
  },
  {
    id: 5,
    text: 'Mes produits',
    icon: PersonIcon,
    path: '/products',
    component: ProductsContainer,
  },
];

export default routes;
