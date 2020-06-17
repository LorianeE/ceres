import {Product} from "../models/Product";
import {ShelfTypes} from "../models/ShelfTypes";
import {ProductsService} from "./ProductsService";
import {PlatformTest} from "@tsed/common";

async function getProductService(locals: any[]) {
  const prototype = {
    save: jest.fn().mockReturnThis()
  };
  const productModel = jest.fn().mockImplementation(() => {
    return prototype;
  });
  // @ts-ignore
  productModel.find = jest.fn();
  locals.push({
    token: Product,
    use: productModel
  });

  return {
    productService: (await PlatformTest.invoke(ProductsService, locals)) as ProductsService,
    productModel,
    prototype
  };
}

describe("ProductsService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("findAllGenerics()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    it("should return all products from db without userIds", async () => {
      // GIVEN
      const products = {
        find: jest.fn().mockResolvedValue([{_id: "eggs"}])
      };
      const productsService = await PlatformTest.invoke(ProductsService, [
        {
          token: Product,
          use: products
        }
      ]);

      // WHEN
      const result = await productsService.findAllGenerics();

      // THEN
      expect(result).toEqual([{_id: "eggs"}]);
      expect(products.find).toHaveBeenCalled();
      expect(productsService).toBeInstanceOf(ProductsService);
    });
  });
  describe("findUsersProducts()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    it("should return all products from db with userIds", async () => {
      // GIVEN
      const products = {
        find: jest.fn().mockResolvedValue([{id: "butter", userIds: ["userId"]}])
      };
      const productsService = await PlatformTest.invoke(ProductsService, [
        {
          token: Product,
          use: products
        }
      ]);

      // WHEN
      const result = await productsService.findUsersProducts("userId");

      // THEN
      expect(result).toEqual([{id: "butter", userIds: ["userId"]}]);
      expect(products.find).toHaveBeenCalledWith({userIds: "userId"});
      expect(productsService).toBeInstanceOf(ProductsService);
    });
  });
  describe("save()", () => {
    it("should save product", async () => {
      // GIVEN
      const product = new Product();
      product.label = "Label";
      product.shelf = ShelfTypes.COLD;
      product.minimumQuantity = 1;

      const {productService, productModel, prototype} = await getProductService([]);

      // WHEN
      await productService.save(product);

      // THEN
      expect(productModel).toHaveBeenCalledWith(product);
      expect(prototype.save).toHaveBeenCalledWith();
    });
    it("should throw duplicate key error", async () => {
      // GIVEN
      const product = new Product();
      product.label = "Label";
      product.shelf = ShelfTypes.COLD;
      product.minimumQuantity = 1;

      const error: any = {};
      error.code = 11000;
      error.errmsg = "Duplicate error message";

      const {productService, productModel, prototype} = await getProductService([]);
      prototype.save.mockRejectedValue(error);

      // WHEN
      let actualError: any;
      try {
        await productService.save(product);
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(productModel).toHaveBeenCalledWith(product);
      expect(prototype.save).toHaveBeenCalledWith();
      expect(actualError.message).toEqual("Duplicate error message");
      expect(actualError.status).toEqual(400);
    });
    it("should throw error", async () => {
      // GIVEN
      const product = new Product();
      product.label = "Label";
      product.shelf = ShelfTypes.COLD;
      product.minimumQuantity = 1;

      const error = new Error("Error on save");

      const {productService, productModel, prototype} = await getProductService([]);
      prototype.save.mockRejectedValue(error);

      // WHEN
      let actualError: any;
      try {
        await productService.save(product);
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(productModel).toHaveBeenCalledWith(product);
      expect(prototype.save).toHaveBeenCalledWith();
      expect(actualError.message).toEqual("Error on save");
    });
  });
});
