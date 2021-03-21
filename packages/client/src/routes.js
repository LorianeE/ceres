import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import KitchenIcon from '@material-ui/icons/Kitchen';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PersonIcon from '@material-ui/icons/Person';
import ShoppingContainer from './components/shopping/ShoppingContainer';
import Menu from './components/menu/Menu';
import Recipes from './components/recipes/Recipes';
import ProductsContainer from './components/products/ProductsContainer';
import EditProductForm from './components/products/EditProductForm';
import StoreContainer from './components/store/StoreContainer';
import AddRecipe from './components/recipes/AddRecipe';

const routes = [
  {
    id: 1,
    text: 'Liste de courses',
    icon: ShoppingCartIcon,
    path: '/shoppinglist',
    inDrawer: true,
    component: ShoppingContainer,
  },
  {
    id: 2,
    text: 'Réserve',
    icon: KitchenIcon,
    path: '/store',
    inDrawer: true,
    component: StoreContainer,
  },
  {
    id: 3,
    text: 'Menu',
    icon: RestaurantMenuIcon,
    path: '/menu',
    inDrawer: true,
    component: Menu,
  },
  {
    id: 4,
    text: 'Recettes',
    icon: MenuBookIcon,
    path: '/recipes',
    inDrawer: true,
    component: Recipes,
  },
  {
    id: 5,
    text: 'Mes produits',
    icon: PersonIcon,
    path: '/products',
    inDrawer: true,
    component: ProductsContainer,
  },
  {
    id: 6,
    text: 'Ajouter un nouveau produit',
    path: '/products/add',
    inDrawer: false,
    component: EditProductForm,
  },
  {
    id: 7,
    text: 'Editer un produit',
    path: '/products/:id/edit',
    inDrawer: false,
    component: EditProductForm,
  },
  {
    id: 8,
    text: 'Ajouter une nouvelle recette',
    path: '/recipes/add',
    inDrawer: false,
    component: AddRecipe,
  },
];

export default routes;
