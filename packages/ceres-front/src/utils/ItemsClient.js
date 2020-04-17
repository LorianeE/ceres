import httpClient from './HttpClient';

async function getProductsList() {
  let items;
  try {
    items = await httpClient.get('http://localhost:8083/rest/products');
    return items;
  } catch (e) {
    throw Error('Could not get products list from server');
  }
}

export default getProductsList;
