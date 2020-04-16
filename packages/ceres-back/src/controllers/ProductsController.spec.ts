import { TestContext } from "@tsed/testing";
import { ProductsController } from "./ProductsController";

describe("ProductsController", () => {
  beforeEach(TestContext.create);
  afterEach(TestContext.reset);

  it("should do something", TestContext.inject([ProductsController], (controller: ProductsController) => {
    expect(controller).toBeInstanceOf(ProductsController);
  }));
});
