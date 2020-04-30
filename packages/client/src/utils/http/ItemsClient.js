import httpClient from './HttpClient';

async function getProductsList() {
  const items = await httpClient.get('/rest/products');
  return items.sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });
}

export default getProductsList;
