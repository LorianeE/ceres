import {TestContext} from "@tsed/testing";
import {ProductsController} from "./ProductsController";
import {ProductsService} from "../services/ProductsService";
import {Product} from "../models/Product";
import {ShelfTypes} from "../models/ShelfTypes";
import {DuplicateKeyError} from "../services/errors/DuplicateKeyError";
import {BadRequest} from "ts-httpexceptions";

describe("ProductsController", () => {
  describe("get()", () => {
    beforeEach(() => TestContext.create());
    afterEach(() => TestContext.reset());

    it("should return a result from mocked service", async () => {
      // GIVEN
      const productsService = {
        findAll: jest.fn().mockResolvedValue([{id: "eggs"}]),
      };

      const productsCtrl = await TestContext.invoke(ProductsController, [
        {
          provide: ProductsService,
          use: productsService,
        },
      ]);

      // WHEN
      const result = await productsCtrl.get();

      // THEN
      expect(result).toEqual([{id: "eggs"}]);
      expect(productsService.findAll).toHaveBeenCalled();

      expect(productsCtrl).toBeInstanceOf(ProductsController);
      expect(productsCtrl.productsService).toEqual(productsService);
    });
  });
  describe("addProducts()", () => {
    const product = new Product();
    product.id = "apple";
    product.label = "Pommes";
    product.shelf = ShelfTypes.PRODUCE;

    const products = [product];

    describe("when everything is ok", () => {
      beforeEach(() => TestContext.create());
      afterEach(() => TestContext.reset());

      it("should return saved data", async () => {
        // GIVEN
        const productsService = {
          save: jest.fn().mockResolvedValue(product),
        };

        const productsCtrl = await TestContext.invoke(ProductsController, [
          {
            provide: ProductsService,
            use: productsService,
          },
        ]);

        // WHEN
        const result = await productsCtrl.addProducts(products);

        // THEN
        expect(productsService.save).toHaveBeenCalledTimes(1);
        expect(productsService.save).toHaveBeenCalledWith(product);
      });
    });
    describe("when there is a problem with duplicate key", () => {
      beforeEach(() => TestContext.create());
      afterEach(() => TestContext.reset());

      it("should throw BadRequest error when DuplicateKeyError", async () => {
        // GIVEN
        const error = new DuplicateKeyError();
        error.message = "One key is already in DB";

        const productsService = {
          save: jest.fn().mockRejectedValue(error),
        };

        const productsCtrl = await TestContext.invoke(ProductsController, [
          {
            provide: ProductsService,
            use: productsService,
          },
        ]);

        // WHEN
        let actualError;
        try {
          await productsCtrl.addProducts(products);
        } catch (er) {
          actualError = er;
        }
        // THEN

        expect(productsCtrl.productsService).toEqual(productsService);
        expect(productsService.save).toHaveBeenCalledTimes(1);
        expect(productsService.save).toHaveBeenCalledWith(product);
        expect(actualError).toBeInstanceOf(BadRequest);
        expect(actualError.message).toEqual("One key is already in DB");
      });
    });
    describe("when there is an other problem", () => {
      beforeEach(() => TestContext.create());
      afterEach(() => TestContext.reset());

      it("should throw BadRequest error when DuplicateKeyError", async () => {
        // GIVEN
        const productsService = {
          save: jest.fn().mockRejectedValue(new Error()),
        };

        const productsCtrl = await TestContext.invoke(ProductsController, [
          {
            provide: ProductsService,
            use: productsService,
          },
        ]);

        // WHEN
        let actualError;
        try {
          await productsCtrl.addProducts(products);
        } catch (er) {
          actualError = er;
        }
        // THEN

        expect(productsCtrl.productsService).toEqual(productsService);
        expect(productsService.save).toHaveBeenCalledTimes(1);
        expect(productsService.save).toHaveBeenCalledWith(product);
        expect(actualError).toBeInstanceOf(Error);
      });
    });
  });
});
