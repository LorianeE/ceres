import * as React from 'react';
import useShopping from './ShoppingUtils';

jest.mock('react');
jest.mock('./http/ShoppingClient');

describe('useShopping', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('changeItemQuantity', () => {
    describe('when item does not exist in shoppingList', () => {
      const setState = jest.fn();
      const useStateMock = (initState) => [initState, setState];
      jest.spyOn(React, 'useState').mockImplementation(useStateMock);

      it('should add it', () => {
        // GIVEN
        const itemToChange = {
          product: {
            id: '12345',
            productId: 'apple',
            label: 'Pommes',
          },
        };
        const item = {
          ...itemToChange,
          quantity: 2,
        };

        const initialShoppingList = [
          {
            ...itemToChange,
            quantity: 1,
          },
        ];
        // First call for itemsRemoved
        jest.spyOn(React, 'useState').mockImplementationOnce(useStateMock);
        // Second call for shoppingList
        jest.spyOn(React, 'useState').mockImplementationOnce(() => [initialShoppingList, setState]);

        const shopping = useShopping({ id: '1234', shoppingLists: ['1234'] });
        const { shoppingList, changeItemQuantity } = shopping;

        // WHEN
        changeItemQuantity(itemToChange, 1);
        // THEN
        expect(setState).toHaveBeenCalledTimes(1);
        expect(setState).toHaveBeenCalledWith([item]);
        expect(shoppingList).toContainEqual(item);
      });
    });
    describe('when item does exist in shoppingList with quantity > 1', () => {
      const itemToChange = {
        product: {
          id: 'apple',
          label: 'Pommes',
        },
      };
      const initialShoppingList = [
        {
          ...itemToChange,
          quantity: 1,
        },
      ];
      const setState = jest.fn();
      const useStateMock = (initState) => [initState, setState];
      // First call for itemsRemoved
      jest.spyOn(React, 'useState').mockImplementationOnce(useStateMock);
      // Second call for shoppingList
      jest.spyOn(React, 'useState').mockImplementationOnce(() => [initialShoppingList, setState]);

      const shopping = useShopping();
      const { shoppingList, changeItemQuantity } = shopping;
      it('should update it', () => {
        // GIVEN
        const updatedItem = {
          product: {
            id: 'apple',
            label: 'Pommes',
          },
          quantity: 2,
        };

        // WHEN
        changeItemQuantity(itemToChange, 1);
        // THEN
        expect(setState).toHaveBeenCalledTimes(1);
        expect(setState).toHaveBeenCalledWith([updatedItem]);
        expect(shoppingList).toContainEqual(updatedItem);
      });
    });
    describe('when item does exist in shoppingList but after quantity is <= 0', () => {
      const itemToChange = {
        product: {
          id: 'apple',
          label: 'Pommes',
        },
      };
      const initialShoppingList = [
        {
          ...itemToChange,
          quantity: 1,
        },
      ];
      const setState = jest.fn();
      const useStateMock = (initState) => [initState, setState];
      // First call for itemsRemoved
      jest.spyOn(React, 'useState').mockImplementationOnce(useStateMock);
      // Second call for shoppingList
      jest.spyOn(React, 'useState').mockImplementationOnce(() => [initialShoppingList, setState]);

      const shopping = useShopping();
      const { shoppingList, changeItemQuantity } = shopping;
      it('should update it', () => {
        // WHEN
        changeItemQuantity(itemToChange, -1);
        // THEN
        expect(setState).toHaveBeenCalledTimes(1);
        expect(setState).toHaveBeenCalledWith([]);
        expect(shoppingList).toEqual([]);
      });
    });
  });
  describe('removeAddedItem', () => {
    const initialShoppingList = [
      {
        product: {
          id: 'apple',
          label: 'Pommes',
        },
        quantity: 1,
      },
    ];
    const setState = jest.fn();

    // First call for itemsRemoved
    jest.spyOn(React, 'useState').mockImplementationOnce((initState) => [initState, setState]);
    // Second call for shoppingList
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [initialShoppingList, setState]);

    const shopping = useShopping();
    const { removeAddedItem } = shopping;
    it('should remove it', () => {
      // WHEN
      removeAddedItem('apple');
      // THEN
      expect(setState).toHaveBeenCalledTimes(2);
      // Called with empty array for shoppingList
      expect(setState).toHaveBeenCalledWith([]);
      // Called with removed product for itemsRemoved
      expect(setState).toHaveBeenCalledWith([
        {
          product: {
            id: 'apple',
            label: 'Pommes',
          },
          quantity: 1,
        },
      ]);
    });
  });
  describe('cancelRemoveItem', () => {
    describe('with removed item not in the list', () => {
      const initialShoppingList = [
        {
          product: {
            id: 'apple',
            label: 'Pommes',
          },
          quantity: 1,
        },
      ];
      const removedItems = [
        {
          product: {
            id: 'pear',
            label: 'Poires',
          },
          quantity: 1,
        },
      ];
      const setState = jest.fn();

      // First call for itemsRemoved
      jest.spyOn(React, 'useState').mockImplementationOnce(() => [removedItems, setState]);
      // Second call for shoppingList
      jest.spyOn(React, 'useState').mockImplementationOnce(() => [initialShoppingList, setState]);

      const shopping = useShopping();
      const { cancelRemoveItem } = shopping;
      it('should cancel removing', () => {
        // WHEN
        cancelRemoveItem();
        // THEN
        expect(setState).toHaveBeenCalledTimes(2);
        // Called with empty array for itemsRemoved
        expect(setState).toHaveBeenCalledWith([]);
        // Called with removed product for shoppingList
        expect(setState).toHaveBeenCalledWith([
          {
            product: {
              id: 'apple',
              label: 'Pommes',
            },
            quantity: 1,
          },
          {
            product: {
              id: 'pear',
              label: 'Poires',
            },
            quantity: 1,
          },
        ]);
      });
    });
    describe('with removed item in the list', () => {
      const initialShoppingList = [
        {
          product: {
            id: 'apple',
            label: 'Pommes',
          },
          quantity: 2,
        },
      ];
      const removedItems = [
        {
          product: {
            id: 'apple',
            label: 'Pommes',
          },
          quantity: 1,
        },
      ];
      const setState = jest.fn();

      // First call for itemsRemoved
      jest.spyOn(React, 'useState').mockImplementationOnce(() => [removedItems, setState]);
      // Second call for shoppingList
      jest.spyOn(React, 'useState').mockImplementationOnce(() => [initialShoppingList, setState]);

      const shopping = useShopping();
      const { cancelRemoveItem } = shopping;
      it('should cancel removing', () => {
        // WHEN
        cancelRemoveItem();
        // THEN
        expect(setState).toHaveBeenCalledTimes(2);
        // Called with empty array for itemsRemoved
        expect(setState).toHaveBeenCalledWith([]);
        // Called with removed product for shoppingList
        expect(setState).toHaveBeenCalledWith([
          {
            product: {
              id: 'apple',
              label: 'Pommes',
            },
            quantity: 3,
          },
        ]);
      });
    });
  });
});
