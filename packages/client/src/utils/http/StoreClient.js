import httpClient from './HttpClient';
import { mapStoreFromApiToNormalized } from '../StoreMapper';

export async function getStore(userId, storeId) {
  if (storeId) {
    const store = await httpClient.get(`/rest/users/${userId}/store/${storeId}`);
    return mapStoreFromApiToNormalized(store);
  }
  throw new Error('No store id.');
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
