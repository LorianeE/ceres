import shoppingListReducers from './shoppingList.reducers';

describe('shoppingList reducer', () => {
  describe('addItem', () => {
    it('should add an item', () => {
      // GIVEN
      const items = {};
      const state = {
        items,
      };
      const action = {
        type: 'ADD_SHOPPING_ITEM',
        payload: {
          item: {
            id: 'someItemId',
            product: '5e99eaaad50dec61a6705f4e',
            quantity: 1,
          },
        },
      };
      // WHEN
      const result = shoppingListReducers(state, action);
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
        payload: {
          itemId: 'itemId',
          quantityToAdd: 2,
        },
      };
      // WHEN
      const result = shoppingListReducers(state, action);
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
        payload: {
          itemId: 'itemId',
          quantityToAdd: -1,
        },
      };
      // WHEN
      const result = shoppingListReducers(state, action);
      // THEN
      expect(result).toEqual({
        items: {},
      });
    });
  });
});
