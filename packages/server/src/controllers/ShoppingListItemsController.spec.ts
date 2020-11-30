import {PlatformTest} from "@tsed/common";
import {ShoppingListItemsController} from "./ShoppingListItemsController";
import {ShoppingListService} from "../services/ShoppingListService";
import {ShoppingList} from "../models/ShoppingList";
import {ShoppingItem} from "../models/ShoppingItem";

describe("ShoppingListItemsController", () => {
  describe("create()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());

    it("should return a new item", async () => {
      // GIVEN
      const shoppingList = new ShoppingList();
      shoppingList._id = "1234";
      shoppingList.items = [];

      const item = new ShoppingItem();
      item.product = "productId";
      item.quantity = 2;

      const addedItem = {
        id: "itemId",
        ...item
      };

      const shoppingListService = {
        addItem: jest.fn().mockResolvedValue(addedItem)
      };

      const shoppingListItemsCtrl = await PlatformTest.invoke(ShoppingListItemsController, [
        {
          token: ShoppingListService,
          use: shoppingListService
        }
      ]);

      // WHEN
      const result = await shoppingListItemsCtrl.create(item, shoppingList._id);

      // THEN
      expect(shoppingListService.addItem).toHaveBeenCalledTimes(1);
      expect(shoppingListService.addItem).toHaveBeenCalledWith(shoppingList._id, item);
      expect(result).toEqual(addedItem);
    });
  });
  describe("update()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    it("should return a result from shoppinglistservice if ok", async () => {
      // GIVEN
      const item = new ShoppingItem();
      item._id = "itemId";
      item.product = "productId";
      item.quantity = 2;

      const shoppingList = new ShoppingList();
      shoppingList._id = "1234";
      shoppingList.items = [item];

      const updatedItem = {
        ...item,
        quantity: 3,
        comment: "comment"
      };

      const shoppingListService = {
        updateItem: jest.fn().mockResolvedValue(updatedItem)
      };

      const shoppingListItemsCtrl = await PlatformTest.invoke(ShoppingListItemsController, [
        {
          token: ShoppingListService,
          use: shoppingListService
        }
      ]);

      // WHEN
      const result = await shoppingListItemsCtrl.update("1234", item);

      // THEN
      expect(shoppingListService.updateItem).toHaveBeenCalledTimes(1);
      expect(shoppingListService.updateItem).toHaveBeenCalledWith("1234", item);
      expect(result).toEqual(updatedItem);
    });
  });
  describe("removeItem()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    it("should call delete method from shoppinglistservice", async () => {
      // GIVEN
      const item = new ShoppingItem();
      item._id = "itemId";

      const shoppingList = new ShoppingList();
      shoppingList._id = "1234";

      const shoppingListService = {
        deleteItem: jest.fn()
      };

      const shoppingListItemsCtrl = await PlatformTest.invoke(ShoppingListItemsController, [
        {
          token: ShoppingListService,
          use: shoppingListService
        }
      ]);

      // WHEN
      await shoppingListItemsCtrl.removeItem(item._id, shoppingList._id);

      // THEN
      expect(shoppingListService.deleteItem).toHaveBeenCalledTimes(1);
      expect(shoppingListService.deleteItem).toHaveBeenCalledWith("1234", "itemId");
    });
  });
});
