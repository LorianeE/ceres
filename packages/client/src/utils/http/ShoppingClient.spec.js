import HttpClient from './HttpClient';
import { getShoppingListItems, saveShoppingListItems } from './ShoppingClient';
import { getShoppingListFromStorage, setShoppingListInStorage } from '../StorageUtils';
import * as config from '../../config.json';

jest.mock('./HttpClient');
jest.mock('../StorageUtils');

describe('ShoppingClient', () => {
  const shoppingList = {
    id: '1234',
    items: [{ label: 'itemLabel' }],
  };
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getShoppingListItems', () => {
    describe('when there is a shopping list in storage', () => {
      beforeEach(() => {
        getShoppingListFromStorage.mockReturnValue(shoppingList);
      });
      it('should return items from shopping list', async () => {
        // WHEN
        const result = await getShoppingListItems();
        // THEN
        expect(result).toEqual(shoppingList.items);
        expect(HttpClient.get).toHaveBeenCalledTimes(0);
      });
    });

    describe('when there is no shopping list in storage', () => {
      beforeEach(() => {
        getShoppingListFromStorage.mockReturnValue(undefined);
        HttpClient.get.mockResolvedValue(shoppingList);
      });
      it('should return items from shopping list from server', async () => {
        // WHEN
        const result = await getShoppingListItems();
        // THEN
        expect(result).toEqual(shoppingList.items);
        expect(getShoppingListFromStorage).toHaveBeenCalledTimes(1);
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
        // WHEN
        let actualError;
        try {
          await saveShoppingListItems(shoppingListItems);
        } catch (e) {
          actualError = e;
        }
        // THEN
        expect(HttpClient.put).toHaveBeenCalledTimes(1);
        expect(HttpClient.put).toHaveBeenCalledWith(`${config.server.url}/rest/shopping-lists/${shoppingList.id}`, shoppingList);
        expect(actualError).toEqual(undefined);
      });
    });
  });
});
