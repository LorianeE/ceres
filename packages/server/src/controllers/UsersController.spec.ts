import {PlatformTest} from "@tsed/common";
import {Unauthorized} from "@tsed/exceptions";
import {ShoppingListsController} from "./ShoppingListsController";
import {ShoppingListService} from "../services/ShoppingListService";
import User from "../models/User";
import {UsersService} from "../services/users/UsersService";
import {ProductsService} from "../services/ProductsService";
import {UsersController} from "./UsersController";
import {Product} from "../models/Product";

describe("UsersController", () => {
  describe("getProducts()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    describe("with an authorized user", () => {
      const user = new User();
      user._id = "userId";
      it("should return a result from productsService if not undefined", async () => {
        // GIVEN
        const productsService = {
          findUsersProducts: jest.fn().mockResolvedValue([{id: "1"}]),
        };

        const usersCtrl = await PlatformTest.invoke(UsersController, [
          {
            token: ProductsService,
            use: productsService,
          },
        ]);

        // WHEN
        const result = await usersCtrl.getProducts("userId", user);

        // THEN
        expect(result).toEqual([{id: "1"}]);
        expect(productsService.findUsersProducts).toHaveBeenCalledTimes(1);
        expect(productsService.findUsersProducts).toHaveBeenCalledWith("userId");

        expect(usersCtrl).toBeInstanceOf(UsersController);
        expect(usersCtrl.productsService).toEqual(productsService);
      });
      it("should return Unauthorized error if user id does not match authorized user id", async () => {
        // GIVEN
        const productsService = {
          findUsersProducts: jest.fn().mockResolvedValue([{id: "1"}]),
        };

        const usersCtrl = await PlatformTest.invoke(UsersController, [
          {
            token: ProductsService,
            use: productsService,
          },
        ]);

        // WHEN
        let actualError;
        try {
          const result = await usersCtrl.getProducts("invalidUserId", user);
        } catch (e) {
          actualError = e;
        }

        // THEN
        expect(usersCtrl.productsService).toEqual(productsService);
        expect(actualError).toBeInstanceOf(Unauthorized);
      });
    });
    describe("with an unauthorized user", () => {
      const user = new User();
      user._id = "userId";
      it("should throw a Unauthorized error", async () => {
        // GIVEN
        const shoppingListService = {
          find: jest.fn().mockResolvedValue({id: "1", items: []}),
        };
        const usersService = {
          findOne: jest.fn().mockResolvedValue({id: "123", shoppingLists: ["123"]}),
        };

        const shoppingListCtrl = await PlatformTest.invoke(ShoppingListsController, [
          {
            token: ShoppingListService,
            use: shoppingListService,
          },
          {
            token: UsersService,
            use: usersService,
          },
        ]);

        // WHEN
        let error;
        try {
          await shoppingListCtrl.get({}, "1", user);
        } catch (err) {
          error = err;
        }

        // THEN
        expect(error).toBeInstanceOf(Unauthorized);
      });
    });
  });
  describe("addProduct()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());

    it("should save product with associated user id", async () => {
      // GIVEN
      const user = new User();
      user._id = "userId";

      const product = new Product();

      const productsService = {
        save: jest.fn(),
      };

      const usersCtrl = await PlatformTest.invoke(UsersController, [
        {
          token: ProductsService,
          use: productsService,
        },
      ]);

      // WHEN
      const result = await usersCtrl.addProduct("userId", product, user);

      // THEN
      expect(productsService.save).toHaveBeenCalledTimes(1);
      expect(productsService.save).toHaveBeenCalledWith({...product, userIds: ["userId"]});
    });
    it("should throw error if productsService throws error", async () => {
      // GIVEN
      const user = new User();
      user._id = "userId";

      const product = new Product();

      const productsService = {
        save: jest.fn().mockRejectedValue(new Error("An error occured")),
      };

      const usersCtrl = await PlatformTest.invoke(UsersController, [
        {
          token: ProductsService,
          use: productsService,
        },
      ]);

      // WHEN
      let actualError;
      try {
        await usersCtrl.addProduct("userId", product, user);
      } catch (e) {
        actualError = e;
      }

      // THEN
      expect(productsService.save).toHaveBeenCalledTimes(1);
      expect(actualError).toBeInstanceOf(Error);
    });
  });
  describe("updateProduct()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    const user = new User();
    user._id = "userId";
    it("should return response from productsService", async () => {
      // GIVEN
      const productsService = {
        updateProduct: jest.fn(),
      };

      const product = new Product();

      const usersCtrl = await PlatformTest.invoke(UsersController, [
        {
          token: ProductsService,
          use: productsService,
        },
      ]);

      // WHEN
      const result = await usersCtrl.updateProduct("userId", "productId", product, user);

      // THEN
      expect(productsService.updateProduct).toHaveBeenCalledTimes(1);
      expect(productsService.updateProduct).toHaveBeenCalledWith(product, "userId");

      expect(usersCtrl).toBeInstanceOf(UsersController);
      expect(usersCtrl.productsService).toEqual(productsService);
    });
  });
  describe("removeProduct()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    const user = new User();
    user._id = "userId";
    it("should return response from productsService", async () => {
      // GIVEN
      const productsService = {
        removeUserFromProduct: jest.fn(),
      };

      const usersCtrl = await PlatformTest.invoke(UsersController, [
        {
          token: ProductsService,
          use: productsService,
        },
      ]);

      // WHEN
      const result = await usersCtrl.removeProduct("userId", "productId", user);

      // THEN
      expect(productsService.removeUserFromProduct).toHaveBeenCalledTimes(1);
      expect(productsService.removeUserFromProduct).toHaveBeenCalledWith("productId", "userId");

      expect(usersCtrl).toBeInstanceOf(UsersController);
      expect(usersCtrl.productsService).toEqual(productsService);
    });
  });
});
