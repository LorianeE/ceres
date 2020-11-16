import {PlatformTest} from "@tsed/common";
import {ShoppingListService} from "./ShoppingListService";
import {ShoppingList} from "../models/ShoppingList";

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
          exec: jest.fn().mockResolvedValue([{id: "1234"}])
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
      expect(result).toEqual([{id: "1234"}]);
      expect(shoppingList.findById).toHaveBeenCalled();

      expect(shoppingListService).toBeInstanceOf(ShoppingListService);
    });
  });
  describe("save()", () => {
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
});
