import httpClient from './HttpClient';
import { mapStoreFromApiToNormalized } from '../StoreMapper';

export async function getStore(userId) {
  const store = await httpClient.get(`/rest/users/${userId}/store`);
  return mapStoreFromApiToNormalized(store);
}

export async function postStore(userId, store) {
  const newStore = await httpClient.post(`/rest/users/${userId}/store`, store);
  return mapStoreFromApiToNormalized(newStore);
}

export async function postStoreItem(userId, storeId, item) {
  return httpClient.post(`/rest/users/${userId}/store/${storeId}/items`, item);
}

export async function putStoreItem(userId, storeId, item) {
  return httpClient.put(`/rest/users/${userId}/store/${storeId}/items/${item.id}`, item);
}
