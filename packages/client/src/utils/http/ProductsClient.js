import httpClient from './HttpClient';
import { sortByLabel } from '../ProductsUtils';

export async function getProductsList() {
  const items = await httpClient.get('/rest/products?genericsOnly=true');
  return sortByLabel(items);
}

export async function getUserProductsList(userId) {
  const items = await httpClient.get(`/rest/users/${userId}/products`);
  return sortByLabel(items);
}

export async function addUserProduct(userId, product) {
  return httpClient.post(`/rest/users/${userId}/products`, product);
}

export async function updateUserProduct(userId, product) {
  return httpClient.put(`/rest/users/${userId}/products/${product.id}`, product);
}

export async function deleteUserProduct(userId, productId) {
  return httpClient.delete(`/rest/users/${userId}/products/${productId}`);
}
