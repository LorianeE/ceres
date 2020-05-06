import shoppingList from './shoppingList';

describe('addItem', () => {
  it('should add an item with id already set', () => {
    // GIVEN
    const items = {};
    const state = {
      items,
    };
    const action = {
      type: 'ADD_ITEM',
      data: {
        item: {
          product: { id: '5e99eaaad50dec61a6705f4e', productId: 'garlic', label: 'Ail', shelf: 'produce', minimumQuantity: 0 },
          quantity: 1,
        },
      },
    };
    // WHEN
    const result = shoppingList(state, action);
    // THEN
    expect(Object.values(result.items)[0]).toEqual({
      id: expect.anything(),
      quantity: 1,
      product: '5e99eaaad50dec61a6705f4e',
    });
  });
});
