import {PlatformTest} from "@tsed/common";
import {BadRequest} from "@tsed/exceptions";
import {CheckProductIdMiddleware} from "./CheckProductIdMiddleware";
import {Product} from "../models/Product";

describe("CheckProductIdMiddleware", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should throw Unauthorized error if user id does not match authorized user id", async () => {
    // GIVEN
    const checkProductIdMiddleware = PlatformTest.get<CheckProductIdMiddleware>(CheckProductIdMiddleware);
    const productId = "productId";
    const product = new Product();
    product._id = "anotherproduct";

    // WHEN
    let actualError;
    try {
      await checkProductIdMiddleware.use(productId, product);
    } catch (e) {
      actualError = e;
    }

    // THEN
    expect(actualError).toBeInstanceOf(BadRequest);
  });
  it("should not throw Unauthorized error if user id does match authorized user id", async () => {
    // GIVEN
    const checkProductIdMiddleware = PlatformTest.get<CheckProductIdMiddleware>(CheckProductIdMiddleware);
    const productId = "productId";
    const product = new Product();
    product._id = "productId";

    // WHEN
    let actualError;
    try {
      await checkProductIdMiddleware.use(productId, product);
    } catch (e) {
      actualError = e;
    }

    // THEN
    expect(actualError).toBeUndefined();
  });
});
