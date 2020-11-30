import {PlatformTest} from "@tsed/common";
import {BadRequest} from "@tsed/exceptions";
import {CheckItemIdMiddleware} from "./CheckItemIdMiddleware";
import {ShoppingItem} from "../models/ShoppingItem";

describe("CheckItemIdMiddleware", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should throw BadRequest error if item id does not match id in param", async () => {
    // GIVEN
    const checkItemIdMiddleware = PlatformTest.get<CheckItemIdMiddleware>(CheckItemIdMiddleware);
    const itemId = "itemId";
    const item = new ShoppingItem();
    item._id = "anotherItem";

    // WHEN
    let actualError;
    try {
      await checkItemIdMiddleware.use(itemId, item);
    } catch (e) {
      actualError = e;
    }

    // THEN
    expect(actualError).toBeInstanceOf(BadRequest);
  });
  it("should not throw BadRequest error if item id does match id in param", async () => {
    // GIVEN
    const checkItemIdMiddleware = PlatformTest.get<CheckItemIdMiddleware>(CheckItemIdMiddleware);
    const itemId = "itemId";
    const item = new ShoppingItem();
    item._id = "itemId";

    // WHEN
    let actualError;
    try {
      await checkItemIdMiddleware.use(itemId, item);
    } catch (e) {
      actualError = e;
    }

    // THEN
    expect(actualError).toBeUndefined();
  });
});
