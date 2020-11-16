import {PlatformTest} from "@tsed/common";
import {User} from "../models/User";
import {ProductsService} from "../services/ProductsService";
import {UserProductsController} from "./UserProductsController";
import {Product} from "../models/Product";

describe("UserProductsController", () => {
  describe("getProducts()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    describe("with an authorized user", () => {
      const user = new User();
      user._id = "userId";
      it("should return a result from productsService if not undefined", async () => {
        // GIVEN
        const productsService = {
          findUsersProducts: jest.fn().mockResolvedValue([{id: "1"}])
        };

        const usersCtrl = await PlatformTest.invoke(UserProductsController, [
          {
            token: ProductsService,
            use: productsService
          }
        ]);

        // WHEN
        const result = await usersCtrl.getProducts("userId", user);

        // THEN
        expect(result).toEqual([{id: "1"}]);
        expect(productsService.findUsersProducts).toHaveBeenCalledTimes(1);
        expect(productsService.findUsersProducts).toHaveBeenCalledWith("userId");

        expect(usersCtrl).toBeInstanceOf(UserProductsController);
        expect(usersCtrl.productsService).toEqual(productsService);
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
        addUserToProduct: jest.fn()
      };

      const usersCtrl = await PlatformTest.invoke(UserProductsController, [
        {
          token: ProductsService,
          use: productsService
        }
      ]);

      // WHEN
      await usersCtrl.addProduct("userId", product);

      // THEN
      expect(productsService.addUserToProduct).toHaveBeenCalledTimes(1);
      expect(productsService.addUserToProduct).toHaveBeenCalledWith("userId", product);
    });
    it("should throw error if productsService throws error", async () => {
      // GIVEN
      const user = new User();
      user._id = "userId";

      const product = new Product();

      const productsService = {
        addUserToProduct: jest.fn().mockRejectedValue(new Error("An error occured"))
      };

      const usersCtrl = await PlatformTest.invoke(UserProductsController, [
        {
          token: ProductsService,
          use: productsService
        }
      ]);

      // WHEN
      let actualError;
      try {
        await usersCtrl.addProduct("userId", product);
      } catch (e) {
        actualError = e;
      }

      // THEN
      expect(productsService.addUserToProduct).toHaveBeenCalledTimes(1);
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
        updateProduct: jest.fn()
      };

      const product = new Product();

      const usersCtrl = await PlatformTest.invoke(UserProductsController, [
        {
          token: ProductsService,
          use: productsService
        }
      ]);

      // WHEN
      await usersCtrl.updateProduct("userId", "productId", product, user);

      // THEN
      expect(productsService.updateProduct).toHaveBeenCalledTimes(1);
      expect(productsService.updateProduct).toHaveBeenCalledWith(product, "userId");

      expect(usersCtrl).toBeInstanceOf(UserProductsController);
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
        removeProductFromUser: jest.fn()
      };

      const usersCtrl = await PlatformTest.invoke(UserProductsController, [
        {
          token: ProductsService,
          use: productsService
        }
      ]);

      // WHEN
      await usersCtrl.removeProduct("userId", "productId");

      // THEN
      expect(productsService.removeProductFromUser).toHaveBeenCalledTimes(1);
      expect(productsService.removeProductFromUser).toHaveBeenCalledWith("productId", "userId");

      expect(usersCtrl).toBeInstanceOf(UserProductsController);
      expect(usersCtrl.productsService).toEqual(productsService);
    });
  });
});
