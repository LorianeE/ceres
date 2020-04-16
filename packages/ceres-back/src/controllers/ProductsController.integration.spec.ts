import { PlatformApplication, ServerLoader } from "@tsed/common";
import { TestContext } from "@tsed/testing";
import * as SuperTest from "supertest";
import { ProductsController, products } from "./ProductsController";
import { Server } from "../Server";

describe("ProductsController", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(TestContext.bootstrap(Server, {
    mount: {
      "/": ProductsController
    }
  }));
  beforeEach(TestContext.inject([PlatformApplication], (app: PlatformApplication) => {
    request = SuperTest(app.raw);
  }));

  afterEach(TestContext.reset);

  it("should call GET /products", async () => {
     const response = await request.get("/products").expect(200);

     expect(response.body).toEqual(products);
  });
});
