import HttpClient from './HttpClient';
import getProductsList from './ItemsClient';

jest.mock('./HttpClient');

describe('ItemsClient', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getProductsList', () => {
    describe('when everything is ok', () => {
      const items = [
        {
          label: 'AAAAAA',
        },
        {
          label: 'DDDDDD',
        },
        {
          label: 'CCCCCC',
        },
        {
          label: 'BBBBBB',
        },
      ];
      const sortedItems = [
        {
          label: 'AAAAAA',
        },
        {
          label: 'BBBBBB',
        },
        {
          label: 'CCCCCC',
        },
        {
          label: 'DDDDDD',
        },
      ];
      beforeEach(() => {
        HttpClient.get.mockResolvedValue(items);
      });
      it('should sort array with labels alphabetically', async () => {
        // WHEN
        const result = await getProductsList();
        // THEN
        expect(result).toEqual(sortedItems);
      });
    });
  });
});
