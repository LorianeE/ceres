import httpClient from './HttpClient';

async function getProductsList() {
  let items;
  try {
    items = await httpClient.get('/rest/products');
    return items.sort((a, b) => {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });
  } catch (e) {
    throw Error('Could not get products list from server');
  }
}

export default getProductsList;
