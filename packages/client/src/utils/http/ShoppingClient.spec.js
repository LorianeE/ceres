import HttpClient from './HttpClient';
import { getShoppingList } from './ShoppingClient';
import { setShoppingListInStorage } from '../StorageUtils';

jest.mock('./HttpClient');
jest.mock('../StorageUtils');

describe('ShoppingClient', () => {
  const apiShoppingList = {
    id: '1234',
    items: [{ product: '1234', quantity: 1, id: '1111' }],
  };
  const normalizedShoppingList = {
    id: '1234',
    items: {
      1111: {
        product: '1234',
        quantity: 1,
        id: '1111',
      },
    },
  };
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getShoppingList', () => {
    describe('when there is no shoppinglist id', () => {
      it('should throw error', async () => {
        // WHEN
        let actualError;
        try {
          await getShoppingList();
        } catch (err) {
          actualError = err;
        }
        // THEN
        expect(actualError.message).toEqual('No shopping list id.');
        expect(HttpClient.get).toHaveBeenCalledTimes(0);
      });
    });

    describe('when there is a shopping list id', () => {
      beforeEach(() => {
        HttpClient.get.mockResolvedValue(apiShoppingList);
      });
      it('should return items from shopping list from server', async () => {
        // WHEN
        const result = await getShoppingList('userId', '1234');
        // THEN
        expect(result).toEqual(normalizedShoppingList);
        expect(setShoppingListInStorage).toHaveBeenCalledTimes(1);
        expect(HttpClient.get).toHaveBeenCalledTimes(1);
      });
    });
  });
});
