import {PlatformTest} from "@tsed/common";
import {ShoppingListService} from "./ShoppingListService";
import {ShoppingList} from "../models/ShoppingList";
import {ShoppingItem} from "../models/ShoppingItem";
import {NotFound} from "@tsed/exceptions";

describe("ShoppingListService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  afterEach(() => jest.resetAllMocks());
  describe("find()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());

    it("should return a specific shopping list", async () => {
      // GIVEN
      const shoppingList = {
        findById: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({id: "1234"})
        })
      };

      const shoppingListService = await PlatformTest.invoke(ShoppingListService, [
        {
          token: ShoppingList,
          use: shoppingList
        }
      ]);

      // WHEN
      const result = await shoppingListService.find("1234");

      // THEN
      expect(result).toEqual({id: "1234"});
      expect(shoppingList.findById).toHaveBeenCalled();

      expect(shoppingListService).toBeInstanceOf(ShoppingListService);
    });
  });
  describe("save()", () => {
    async function getShoppinglistService(locals: any[]) {
      const prototype = {};
      const shoppingListModel = jest.fn().mockImplementation(() => {
        return prototype;
      });
      // @ts-ignore
      shoppingListModel.findOneAndUpdate = jest.fn().mockReturnValue({exec: () => jest.fn()});
      locals.push({
        token: ShoppingList,
        use: shoppingListModel
      });

      return {
        shoppingListService: (await PlatformTest.invoke(ShoppingListService, locals)) as ShoppingListService,
        shoppingListModel,
        prototype
      };
    }
    it("should save shoppingList without _id", async () => {
      // GIVEN
      const shoppingList = new ShoppingList();
      shoppingList.items = [];

      const {shoppingListService, shoppingListModel} = await getShoppinglistService([]);

      // WHEN
      await shoppingListService.save(shoppingList);

      // THEN
      // @ts-ignore
      expect(shoppingListModel.findOneAndUpdate).toHaveBeenCalledWith(expect.anything(), shoppingList, {upsert: true, new: true});
    });
  });
  describe("addItem()", () => {
    it("should add item to shoppingList if found", async () => {
      // GIVEN
      const item = new ShoppingItem();
      item._id = "itemId";
      item.product = "productId";
      item.quantity = 1;

      // GIVEN
      const shoppingListModel = {
        findByIdAndUpdate: jest.fn().mockReturnValue({
          exec: jest.fn()
        })
      };
      const shoppingItemModel = jest.fn().mockImplementation(() => {
        return item;
      });

      const shoppingListService = await PlatformTest.invoke(ShoppingListService, [
        {
          token: ShoppingList,
          use: shoppingListModel
        },
        {
          token: ShoppingItem,
          use: shoppingItemModel
        }
      ]);

      // WHEN
      const result = await shoppingListService.addItem("1234", item);

      // THEN
      expect(result).toEqual(item);
      expect(shoppingListModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(shoppingListModel.findByIdAndUpdate).toHaveBeenCalledWith("1234", {$push: {items: item}});
    });
  });
  describe("updateItem()", () => {
    async function getShoppinglistService(locals: any[], itemsInList: any[], findByIdFound: boolean = true) {
      const prototype = {};
      const shoppingListModel = jest.fn().mockImplementation(() => {
        return prototype;
      });
      const shoppingItemModel = jest.fn().mockImplementation((item) => {
        return item;
      });
      // @ts-ignore
      shoppingListModel.findOneAndUpdate = jest.fn().mockReturnValue({exec: () => jest.fn()});
      const saveSpy = jest.fn();
      if (findByIdFound) {
        // @ts-ignore
        shoppingListModel.findById = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({id: "1234", items: itemsInList, save: saveSpy})
        });
      } else {
        // @ts-ignore
        shoppingListModel.findById = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null)
        });
      }

      locals.push({
        token: ShoppingList,
        use: shoppingListModel
      });
      locals.push({
        token: ShoppingItem,
        use: shoppingItemModel
      });

      return {
        shoppingListService: (await PlatformTest.invoke(ShoppingListService, locals)) as ShoppingListService,
        shoppingListModel,
        shoppingItemModel,
        saveSpy
      };
    }
    it("should update item from shoppingList if found", async () => {
      // GIVEN
      const shoppingList = new ShoppingList();
      shoppingList._id = "shoppingListId";
      shoppingList.items = [];
      const item = new ShoppingItem();
      item._id = "itemId";
      item.product = "productId";
      item.quantity = 1;

      const {shoppingListService, shoppingListModel, saveSpy} = await getShoppinglistService([], [item]);

      // WHEN
      await shoppingListService.updateItem("shoppingListId", item);

      // THEN
      // @ts-ignore
      expect(shoppingListModel.findById).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalled();
    });
    it("should throw not found if shoppinglist not found", async () => {
      // GIVEN
      const shoppingList = new ShoppingList();
      shoppingList._id = "shoppingListId";
      shoppingList.items = [];
      const item = new ShoppingItem();
      item._id = "itemId";
      item.product = "productId";
      item.quantity = 1;

      const {shoppingListService, shoppingListModel, saveSpy} = await getShoppinglistService([], [item], false);

      let actualError;
      // WHEN
      try {
        await shoppingListService.updateItem("shoppingListId", item);
      } catch (err) {
        actualError = err;
      }

      // THEN
      // @ts-ignore
      expect(shoppingListModel.findById).toHaveBeenCalled();
      expect(actualError).toBeInstanceOf(NotFound);
      expect(actualError.message).toBe("Shopping list not found.");
      expect(saveSpy).not.toHaveBeenCalled();
    });
    it("should throw not found if shoppinglist item not found", async () => {
      // GIVEN
      const shoppingList = new ShoppingList();
      shoppingList._id = "shoppingListId";
      shoppingList.items = [];
      const item = new ShoppingItem();
      item._id = "itemId";
      item.product = "productId";
      item.quantity = 1;

      const {shoppingListService, shoppingListModel, saveSpy} = await getShoppinglistService([], []);

      let actualError;
      // WHEN
      try {
        await shoppingListService.updateItem("shoppingListId", item);
      } catch (err) {
        actualError = err;
      }

      // THEN
      // @ts-ignore
      expect(shoppingListModel.findById).toHaveBeenCalled();
      expect(actualError).toBeInstanceOf(NotFound);
      expect(actualError.message).toBe("Given item not found in shopping list.");
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });
  describe("deleteItem()", () => {
    it("should delete item from shoppingList", async () => {
      // GIVEN
      const item = new ShoppingItem();
      item._id = "itemId";

      // GIVEN
      const shoppingListModel = {
        findByIdAndUpdate: jest.fn().mockReturnValue({
          exec: jest.fn()
        })
      };

      const shoppingListService = await PlatformTest.invoke(ShoppingListService, [
        {
          token: ShoppingList,
          use: shoppingListModel
        }
      ]);

      // WHEN
      await shoppingListService.deleteItem("1234", item._id);

      // THEN
      expect(shoppingListModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(shoppingListModel.findByIdAndUpdate).toHaveBeenCalledWith("1234", {
        $pull: {
          items: {_id: item._id}
        }
      });
    });
  });
});
