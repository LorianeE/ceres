import {Product} from "../models/Product";
import {ShelfTypes} from "../models/ShelfTypes";
import {ProductsService} from "./ProductsService";
import {PlatformTest} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";

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
    productService: await PlatformTest.invoke(ProductsService, locals) as ProductsService,
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
        find: jest.fn().mockResolvedValue([{_id: "butter", userIds: ["userId"]}])
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
      expect(result).toEqual([{_id: "butter", userIds: ["userId"]}]);
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
  describe("updateProduct()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    it("should update product", async () => {
      // GIVEN
      const product = new Product();
      product._id = "butter";
      product.shelf = ShelfTypes.COLD;
      const products = {
        findOneAndUpdate: jest.fn().mockResolvedValue({_id: "butter", shelf: "grocery"}),
        findOne: jest.fn().mockResolvedValue({_id: "butter", shelf: "cold"}),
      };
      const productsService = await PlatformTest.invoke(ProductsService, [
        {
          token: Product,
          use: products
        }
      ]);

      // WHEN
      const result = await productsService.updateProduct(product, "userId");

      // THEN
      expect(products.findOne).toHaveBeenCalledWith({
        $and: [
          {
            _id: "butter"
          },
          {
            userIds: "userId"
          },
        ]
      });
      expect(products.findOneAndUpdate).toHaveBeenCalledWith(
        {
          $and: [
            {
              _id: product._id
            },
            {
              userIds: "userId"
            },
          ]
        },
        product
      );
      expect(products.findOne).toHaveBeenCalled();
      expect(result).toEqual({_id: "butter", shelf: "cold"});
      expect(productsService).toBeInstanceOf(ProductsService);
    });
    it("should throw notfound if findOneAndUpdate responds undefined", async () => {
      // GIVEN
      const product = new Product();
      product._id = "productId";
      const products = {
        findOneAndUpdate: jest.fn().mockResolvedValue(undefined),
      };
      const productsService = await PlatformTest.invoke(ProductsService, [
        {
          token: Product,
          use: products
        }
      ]);

      // WHEN
      let actualError;
      try {
        await productsService.updateProduct(product, "userId");
      } catch (err) {
        actualError = err;
      }

      // THEN
      expect(products.findOneAndUpdate).toHaveBeenCalledWith(
        {
          $and: [
            {
              _id: "productId"
            },
            {
              userIds: "userId"
            },
          ]
        },
        product);
      expect(actualError).toBeInstanceOf(NotFound);
      expect(productsService).toBeInstanceOf(ProductsService);
    });
  });
  describe("removeUserFromProduct()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    it("should remove userid from product's user ids", async () => {
      // GIVEN
      const save = jest.fn().mockResolvedValue([{_id: "butter", userIds: ["userId2"]}]);
      const products = {
        findOne: jest.fn().mockResolvedValue({_id: "butter", userIds: ["userId", "userId2"], save})
      };
      const productsService = await PlatformTest.invoke(ProductsService, [
        {
          token: Product,
          use: products
        }
      ]);

      // WHEN
      const result = await productsService.removeUserFromProduct("productId", "userId");

      // THEN
      expect(result).toEqual([{_id: "butter", userIds: ["userId2"]}]);
      expect(products.findOne).toHaveBeenCalledWith({
        $and: [
          {
            _id: "productId"
          },
          {
            userIds: "userId"
          },
        ]
      });
      expect(save).toHaveBeenCalledTimes(1);
      expect(productsService).toBeInstanceOf(ProductsService);
    });
    it("should remove product if user ids list is empty after", async () => {
      // GIVEN
      const save = jest.fn().mockResolvedValue([{_id: "butter", userIds: ["userId2"]}]);
      const products = {
        findOne: jest.fn().mockResolvedValue({_id: "butter", userIds: ["userId"], save}),
        deleteOne: jest.fn(),
      };
      const productsService = await PlatformTest.invoke(ProductsService, [
        {
          token: Product,
          use: products
        }
      ]);

      // WHEN
      await productsService.removeUserFromProduct("productId", "userId");

      // THEN
      expect(products.findOne).toHaveBeenCalledWith({
        $and: [
          {
            _id: "productId"
          },
          {
            userIds: "userId"
          },
        ]
      });
      expect(save).not.toHaveBeenCalled();
      expect(products.deleteOne).toHaveBeenCalledWith({_id: "butter"});
      expect(productsService).toBeInstanceOf(ProductsService);
    });
    it("should throw notfound if findOne responds undefined", async () => {
      // GIVEN
      const products = {
        findOne: jest.fn().mockResolvedValue(undefined),
      };
      const productsService = await PlatformTest.invoke(ProductsService, [
        {
          token: Product,
          use: products
        }
      ]);

      // WHEN
      let actualError;
      try {
        await productsService.removeUserFromProduct("productId", "userId");
      } catch (err) {
        actualError = err;
      }

      // THEN
      expect(products.findOne).toHaveBeenCalledWith({
        $and: [
          {
            _id: "productId"
          },
          {
            userIds: "userId"
          },
        ]
      });
      expect(actualError).toBeInstanceOf(NotFound);
      expect(productsService).toBeInstanceOf(ProductsService);
    });
  });
});
