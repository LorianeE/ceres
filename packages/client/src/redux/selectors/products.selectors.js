import { sortByLabel } from '../../utils/ProductsUtils';
import { SHELF_TYPES } from '../../data/shelf_types';

export function getGenericProducts(state) {
  return state.products.dbList;
}

export function getUserProducts(state) {
  return state.products.userList;
}

export function getUserProductsWithDisplayShelf(state) {
  return state.products.userList.map((product) => {
    product.shelf = SHELF_TYPES[product.shelf];
    return product;
  });
}

export function getAllProducts(state) {
  return [...state.products.dbList, ...state.products.userList];
}

export function getAllSortedProducts(state) {
  return sortByLabel([...state.products.dbList, ...state.products.userList]);
}
