import {PlatformTest} from "@tsed/common";
import {UsersController} from "./UsersController";
import {StoreService} from "../services/StoreService";
import {Store} from "../models/Store";
import {UsersService} from "../services/users/UsersService";
import {ShoppingList} from "../models/ShoppingList";
import {User} from "../models/User";
import {ShoppingListService} from "../services/ShoppingListService";

describe("UsersController", () => {
  describe("addShoppingList()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());

    it("should return a result from shoppinglistservice if not undefined", async () => {
      // GIVEN
      const shoppingList = new ShoppingList();
      shoppingList._id = "1234";
      shoppingList.items = [];

      const user = new User();
      user.shoppingLists = [];

      const shoppingListService = {
        save: jest.fn().mockResolvedValue(shoppingList)
      };
      const usersService = {
        addShoppingList: jest.fn().mockResolvedValue(shoppingList)
      };

      const usersCtrl = await PlatformTest.invoke(UsersController, [
        {
          token: ShoppingListService,
          use: shoppingListService
        },
        {
          token: UsersService,
          use: usersService
        }
      ]);

      // WHEN
      const result = await usersCtrl.addShoppingList(shoppingList, user);

      // THEN
      expect(shoppingListService.save).toHaveBeenCalledTimes(1);
      expect(shoppingListService.save).toHaveBeenCalledWith(shoppingList);
      expect(usersService.addShoppingList).toHaveBeenCalledTimes(1);
      expect(usersService.addShoppingList).toHaveBeenCalledWith(user, shoppingList._id);
      expect(result).toEqual(shoppingList);
    });
    it("should throw error if shoppinglistservice throws error", async () => {
      // GIVEN
      const shoppingList = new ShoppingList();
      shoppingList._id = "1234";
      shoppingList.items = [];

      const shoppingListService = {
        save: jest.fn().mockRejectedValue(new Error("An error occured"))
      };

      const usersCtrl = await PlatformTest.invoke(UsersController, [
        {
          token: ShoppingListService,
          use: shoppingListService
        }
      ]);

      // WHEN
      let actualError;
      try {
        await usersCtrl.addShoppingList(shoppingList);
      } catch (e) {
        actualError = e;
      }

      // THEN
      expect(shoppingListService.save).toHaveBeenCalledTimes(1);
      expect(actualError).toBeInstanceOf(Error);
    });
  });
  describe("addStore()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());

    it("should return a result from storeService", async () => {
      // GIVEN
      const store = new Store();
      store._id = "1234";
      store.items = [];

      const storeService = {
        save: jest.fn().mockResolvedValue(store)
      };
      const usersService = {
        addStore: jest.fn()
      };

      const usersCtrl = await PlatformTest.invoke(UsersController, [
        {
          token: StoreService,
          use: storeService
        },
        {
          token: UsersService,
          use: usersService
        }
      ]);

      // WHEN
      const result = await usersCtrl.addStore("userId", store);

      // THEN
      expect(storeService.save).toHaveBeenCalledTimes(1);
      expect(usersService.addStore).toHaveBeenCalledTimes(1);
      expect(storeService.save).toHaveBeenCalledWith(store);
      expect(usersService.addStore).toHaveBeenCalledWith("userId", store);
      expect(result).toEqual(store);
    });
  });
});
