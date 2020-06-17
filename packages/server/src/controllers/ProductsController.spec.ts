import {ProductsController} from "./ProductsController";
import {ProductsService} from "../services/ProductsService";
import {Product} from "../models/Product";
import {ShelfTypes} from "../models/ShelfTypes";
import {PlatformTest} from "@tsed/common";

describe("ProductsController", () => {
  describe("getGenerics()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());

    it("should return a result from mocked service", async () => {
      // GIVEN
      const productsService = {
        findAllGenerics: jest.fn().mockResolvedValue([{id: "eggs"}])
      };

      const productsCtrl = await PlatformTest.invoke(ProductsController, [
        {
          token: ProductsService,
          use: productsService
        }
      ]);

      // WHEN
      const result = await productsCtrl.getGenerics();

      // THEN
      expect(result).toEqual([{id: "eggs"}]);
      expect(productsService.findAllGenerics).toHaveBeenCalled();

      expect(productsCtrl).toBeInstanceOf(ProductsController);
      expect(productsCtrl.productsService).toEqual(productsService);
    });
  });
  describe("addProducts()", () => {
    const product = new Product();
    product.productId = "apple";
    product.label = "Pommes";
    product.shelf = ShelfTypes.PRODUCE;

    const products = [product];

    describe("when everything is ok", () => {
      beforeEach(() => PlatformTest.create());
      afterEach(() => PlatformTest.reset());

      it("should return saved data", async () => {
        // GIVEN
        const productsService = {
          save: jest.fn().mockResolvedValue(product)
        };

        const productsCtrl = await PlatformTest.invoke(ProductsController, [
          {
            token: ProductsService,
            use: productsService
          }
        ]);

        // WHEN
        await productsCtrl.addProducts(products);

        // THEN
        expect(productsService.save).toHaveBeenCalledTimes(1);
        expect(productsService.save).toHaveBeenCalledWith(product);
      });
    });
  });
});
