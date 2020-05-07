import { mapListFromApiToNormalized, mapListFromNormalizedToApi, getFilledShoppingList } from './ShoppingListMapper';

describe('ShoppingListMapper', () => {
  describe('mapListFromApiToNormalized', () => {
    it('should map from api to normalized data', () => {
      // GIVEN
      const apiShoppinglist = {
        id: '1234',
        items: [
          {
            id: 'itemId',
            quantity: 1,
            product: 'productId',
          },
        ],
      };
      const normShopList = {
        id: '1234',
        items: {
          itemId: {
            id: 'itemId',
            quantity: 1,
            product: 'productId',
          },
        },
      };
      // WHEN
      const result = mapListFromApiToNormalized(apiShoppinglist);
      // THEN
      expect(result).toEqual(normShopList);
    });
  });
  describe('mapListFromNormalizedToApi', () => {
    it('should map from normalized data to api', () => {
      // GIVEN
      const normShopList = {
        id: '1234',
        items: {
          itemId: {
            id: 'itemId',
            quantity: 1,
            product: 'productId',
          },
          '1234567890ABCDEFABCD1234': {
            id: '1234567890ABCDEFABCD1234',
            quantity: 2,
            product: 'productId2',
          },
        },
      };
      const apiShoppinglist = {
        id: '1234',
        items: [
          {
            quantity: 1,
            product: 'productId',
          },
          {
            id: '1234567890ABCDEFABCD1234',
            quantity: 2,
            product: 'productId2',
          },
        ],
      };
      // WHEN
      const result = mapListFromNormalizedToApi(normShopList);
      // THEN
      expect(result).toEqual(apiShoppinglist);
    });
  });
  describe('getFilledShoppingList', () => {
    it('should return empty arr y if unfilledItems is undefined', () => {
      // WHEN
      const result = getFilledShoppingList(undefined, [{ id: 'productId' }]);
      // THEN
      expect(result).toEqual([]);
    });
    it('should return empty arr y if products is empty array', () => {
      // WHEN
      const result = getFilledShoppingList({ id: { id: 'id' } }, []);
      // THEN
      expect(result).toEqual([]);
    });
    it('should return filled shopping list items', () => {
      // GIVEN
      const unfilledItems = {
        itemid: {
          itemid: 'id',
          quantity: 1,
          product: '1234',
        },
      };
      const products = [
        {
          id: '1234',
          label: 'Pommes',
        },
      ];
      // WHEN
      const result = getFilledShoppingList(unfilledItems, products);
      // THEN
      expect(result).toEqual([
        {
          itemid: 'id',
          quantity: 1,
          product: {
            id: '1234',
            label: 'Pommes',
          },
        },
      ]);
    });
  });
});
