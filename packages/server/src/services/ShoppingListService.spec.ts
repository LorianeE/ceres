import {PlatformTest} from "@tsed/common";
import {ShoppingListService} from "./ShoppingListService";
import {ShoppingList} from "../models/ShoppingList";

async function getShoppinglistService(locals: any[]) {
  const prototype = {
    updateOne: jest.fn().mockReturnThis()
  };
  const shoppingListModel = jest.fn().mockImplementation(() => {
    return prototype;
  });
  // @ts-ignore
  shoppingListModel.find = jest.fn();
  locals.push({
    token: ShoppingList,
    use: shoppingListModel
  });

  return {
    shoppingListService: await PlatformTest.invoke(ShoppingListService, locals) as ShoppingListService,
    shoppingListModel,
    prototype
  };
}

describe("ShoppingListService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  afterEach(() => jest.resetAllMocks());
  describe("find()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());

    it("should return all products from db", async () => {
      // GIVEN
      const products = {
        findById: jest.fn().mockReturnValue([{id: "1234"}]),
      };

      const shoppingListService = await PlatformTest.invoke(ShoppingListService, [
        {
          token: ShoppingList,
          use: products,
        },
      ]);

      // WHEN
      const result = await shoppingListService.find("1234");

      // THEN
      expect(result).toEqual([{id: "1234"}]);
      expect(products.findById).toHaveBeenCalled();

      expect(shoppingListService).toBeInstanceOf(ShoppingListService);
    });
  });
  describe("save()", () => {
    it("should save shoppingList", async () => {
      // GIVEN
      const shoppingList = new ShoppingList();
      shoppingList.items = [];

      const {shoppingListService, shoppingListModel, prototype} = await getShoppinglistService([]);

      // WHEN
      await shoppingListService.save(shoppingList);

      // THEN
      expect(shoppingListModel).toHaveBeenCalledWith(shoppingList);
      expect(prototype.updateOne).toHaveBeenCalledWith(shoppingList, {upsert: true});
    });
  });
});
