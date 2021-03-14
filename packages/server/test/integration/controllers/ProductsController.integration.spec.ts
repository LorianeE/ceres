import {PlatformTest} from "@tsed/common";
import SuperTest from "supertest";
import {Server} from "../../../src/Server";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {ProductsService} from "../../../src/services/ProductsService";
import {Product} from "../../../src/models/Product";
import {ShelfTypes} from "../../../src/models/ShelfTypes";

describe("Products", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let product: Product;
  let productWithUser: Product;
  let apiInitialProduct: Record<string, unknown>;
  let apiInitialProductWithUser: Record<string, unknown>;

  beforeEach(TestMongooseContext.bootstrap(Server));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });
  beforeEach(
    TestMongooseContext.inject([ProductsService], async (productsService: ProductsService) => {
      // Create new product and put it in DB
      const pdct = new Product();
      pdct.label = "Pommes";
      pdct.shelf = ShelfTypes.PRODUCE;
      product = await productsService.save(pdct);

      apiInitialProduct = {
        id: product._id.toString(),
        label: product.label,
        minimumQuantity: product.minimumQuantity,
        shelf: product.shelf,
        users: []
      };

      const pdct2 = new Product();
      pdct2.label = "Poires Williams";
      pdct2.shelf = ShelfTypes.PRODUCE;
      pdct2.users = ["5fb19cc8f7fc027056ac2e5d"];
      productWithUser = await productsService.save(pdct2);

      apiInitialProductWithUser = {
        id: productWithUser._id.toString(),
        label: productWithUser.label,
        minimumQuantity: productWithUser.minimumQuantity,
        shelf: productWithUser.shelf,
        users: ["5fb19cc8f7fc027056ac2e5d"]
      };
    })
  );
  afterEach(TestMongooseContext.reset);

  describe("GET /rest/products", () => {
    it("should return all products", async () => {
      const response = await request.get("/rest/products").expect(200);
      expect(response.body).toEqual([apiInitialProduct, apiInitialProductWithUser]);
    });
  });
  describe("GET /rest/products?genericsOnly=true", () => {
    it("should return all generic products", async () => {
      const response = await request.get("/rest/products?genericsOnly=true").expect(200);
      expect(response.body).toEqual([apiInitialProduct]);
    });
  });
});
