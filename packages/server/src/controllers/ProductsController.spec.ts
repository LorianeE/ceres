import {TestContext} from "@tsed/testing";
import {ProductsController} from "./ProductsController";
import {ProductsService} from "../services/ProductsService";
import Product from "../models/Product";
import {ShelfTypes} from "../models/ShelfTypes";

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
  });
});
