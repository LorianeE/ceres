import HttpClient from './HttpClient';
import { getShoppingListItems, saveShoppingListItems } from './ShoppingClient';
import { getShoppingListFromStorage, setShoppingListInStorage } from '../StorageUtils';

jest.mock('./HttpClient');
jest.mock('../StorageUtils');

describe('ShoppingClient', () => {
  const shoppingList = {
    id: '1234',
    items: [{ product: { id: '1234', label: 'itemLabel' }, quantity: 1 }],
  };
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getShoppingListItems', () => {
    describe('when there is no shoppinglist id', () => {
      it('should return null', async () => {
        // WHEN
        const result = await getShoppingListItems();
        // THEN
        expect(result).toEqual(null);
        expect(HttpClient.get).toHaveBeenCalledTimes(0);
      });
    });

    describe('when there is a shopping list id', () => {
      beforeEach(() => {
        HttpClient.get.mockResolvedValue(shoppingList);
      });
      it('should return items from shopping list from server', async () => {
        // WHEN
        const result = await getShoppingListItems('1234');
        // THEN
        expect(result).toEqual(shoppingList.items);
        expect(setShoppingListInStorage).toHaveBeenCalledTimes(1);
        expect(HttpClient.get).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe('saveShoppingListItems', () => {
    const shoppingListItems = shoppingList.items;

    describe('when everything is ok', () => {
      beforeEach(() => {
        getShoppingListFromStorage.mockReturnValue(shoppingList);
      });

      it('should call server an no error is thrown', async () => {
        const mappedShoppingList = {
          id: '1234',
          items: [{ product: '1234', quantity: 1 }],
        };
        // WHEN
        let actualError;
        try {
          await saveShoppingListItems(shoppingListItems);
        } catch (e) {
          actualError = e;
        }
        // THEN
        expect(HttpClient.put).toHaveBeenCalledTimes(1);
        expect(HttpClient.put).toHaveBeenCalledWith(`/rest/shopping-lists/${shoppingList.id}`, mappedShoppingList);
        expect(actualError).toEqual(undefined);
      });
    });
  });
});
