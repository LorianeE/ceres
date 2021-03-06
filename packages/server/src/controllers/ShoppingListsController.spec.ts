import {PlatformTest} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {ShoppingListsController} from "./ShoppingListsController";
import {ShoppingListService} from "../services/ShoppingListService";
import {ShoppingList} from "../models/ShoppingList";
import {User} from "../models/User";
import {UsersService} from "../services/users/UsersService";

describe("ShoppingListsController", () => {
  describe("get()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    describe("with an authorized user", () => {
      const user = new User();
      user.shoppingLists = ["1"];
      it("should return a result fr" + "om shoppinglistservice if not undefined", async () => {
        // GIVEN
        const shoppingListService = {
          find: jest.fn().mockResolvedValue({id: "1", items: []})
        };
        const usersService = {
          findOne: jest.fn().mockResolvedValue({id: "123", shoppingLists: ["1"]})
        };

        const shoppingListCtrl = await PlatformTest.invoke(ShoppingListsController, [
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
        const result = await shoppingListCtrl.get("1", user);

        // THEN
        expect(result).toEqual({id: "1", items: []});
        expect(shoppingListService.find).toHaveBeenCalledTimes(1);
        expect(shoppingListService.find).toHaveBeenCalledWith("1");

        expect(shoppingListCtrl).toBeInstanceOf(ShoppingListsController);
        expect(shoppingListCtrl.shoppingListService).toEqual(shoppingListService);
      });
      it("should return notfound error if result from shoppinglistservice is undefined", async () => {
        // GIVEN
        const shoppingListService = {
          find: jest.fn().mockResolvedValue(undefined)
        };
        const usersService = {
          findOne: jest.fn().mockResolvedValue({id: "123", shoppingLists: ["1"]})
        };

        const shoppingListCtrl = await PlatformTest.invoke(ShoppingListsController, [
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
        let actualError;
        try {
          await shoppingListCtrl.get("1", user);
        } catch (e) {
          actualError = e;
        }

        // THEN
        expect(shoppingListCtrl.shoppingListService).toEqual(shoppingListService);
        expect(shoppingListService.find).toHaveBeenCalledTimes(1);
        expect(shoppingListService.find).toHaveBeenCalledWith("1");
        expect(actualError).toBeInstanceOf(NotFound);
      });
    });
  });
  describe("update()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    describe("with an authorized user", () => {
      const user = new User();
      user.shoppingLists = ["1234"];
      it("should return a result from shoppinglistservice if ok", async () => {
        // GIVEN
        const shoppingList = new ShoppingList();
        shoppingList._id = "1234";
        shoppingList.items = [];

        const shoppingListService = {
          save: jest.fn().mockResolvedValue(shoppingList)
        };
        const usersService = {
          findOne: jest.fn().mockResolvedValue({id: "1", shoppingLists: ["1234"]})
        };

        const shoppingListCtrl = await PlatformTest.invoke(ShoppingListsController, [
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
        const result = await shoppingListCtrl.update("1234", shoppingList, user);

        // THEN
        expect(shoppingListService.save).toHaveBeenCalledTimes(1);
        expect(shoppingListService.save).toHaveBeenCalledWith(shoppingList);
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
        const usersService = {
          findOne: jest.fn().mockResolvedValue({id: "123", shoppingLists: ["1234"]})
        };

        const shoppingListCtrl = await PlatformTest.invoke(ShoppingListsController, [
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
        let actualError;
        try {
          await shoppingListCtrl.update("1234", shoppingList, user);
        } catch (e) {
          actualError = e;
        }

        // THEN
        expect(shoppingListService.save).toHaveBeenCalledTimes(1);
        expect(actualError).toBeInstanceOf(Error);
      });
    });
  });
});
