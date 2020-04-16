import { productsList } from '../data/productsList';
import httpClient from './HttpClient';

async function getProductsList() {
  let items;
  try {
    items = await httpClient.get('http://localhost:8080/rest/products');
    return items;
  } catch (e) {
    return productsList;
  }
}

export default getProductsList;
