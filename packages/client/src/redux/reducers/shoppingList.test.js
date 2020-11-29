import shoppingList from './shoppingList';

describe('shoppingList reducer', () => {
  describe('addItem', () => {
    it('should add an item', () => {
      // GIVEN
      const items = {};
      const state = {
        items,
      };
      const action = {
        type: 'ADD_ITEM',
        data: {
          item: {
            id: 'someItemId',
            product: { id: '5e99eaaad50dec61a6705f4e', productId: 'garlic', label: 'Ail', shelf: 'produce', minimumQuantity: 0 },
            quantity: 1,
          },
        },
      };
      // WHEN
      const result = shoppingList(state, action);
      // THEN
      expect(Object.values(result.items)[0]).toEqual({
        id: 'someItemId',
        quantity: 1,
        product: '5e99eaaad50dec61a6705f4e',
      });
    });
  });
  describe('changeItemQuantity', () => {
    it('should change item quantity, final quantity > 0', () => {
      // GIVEN
      const items = {
        itemId: {
          id: 'itemId',
          quantity: 1,
          product: 'productId',
        },
      };
      const state = {
        items,
      };
      const action = {
        type: 'CHANGE_SHOPPING_ITEM_QUANTITY',
        data: {
          itemId: 'itemId',
          quantityToAdd: 2,
        },
      };
      // WHEN
      const result = shoppingList(state, action);
      // THEN
      expect(result).toEqual({
        items: {
          itemId: {
            id: 'itemId',
            quantity: 3,
            product: 'productId',
          },
        },
      });
    });
    it('should change item quantity, final quantity = 0', () => {
      // GIVEN
      const items = {
        itemId: {
          id: 'itemId',
          quantity: 1,
          product: 'productId',
        },
      };
      const state = {
        items,
      };
      const action = {
        type: 'CHANGE_SHOPPING_ITEM_QUANTITY',
        data: {
          itemId: 'itemId',
          quantityToAdd: -1,
        },
      };
      // WHEN
      const result = shoppingList(state, action);
      // THEN
      expect(result).toEqual({
        items: {},
      });
    });
  });
});
