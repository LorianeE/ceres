import {PlatformTest} from "@tsed/common";
import {BadRequest} from "@tsed/exceptions";
import {CheckItemIdMiddleware} from "./CheckItemIdMiddleware";

describe("CheckItemIdMiddleware", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should throw BadRequest error if item id does not match id in param", async () => {
    // GIVEN
    const checkItemIdMiddleware = PlatformTest.get<CheckItemIdMiddleware>(CheckItemIdMiddleware);
    const itemId = "itemId";
    const itemIdInBody = "anotherItem";

    // WHEN
    let actualError;
    try {
      await checkItemIdMiddleware.use(itemId, itemIdInBody);
    } catch (e) {
      actualError = e;
    }

    // THEN
    expect(actualError).toBeInstanceOf(BadRequest);
  });
  it("should throw BadRequest error if item id does match id in param but is not objectid", async () => {
    // GIVEN
    const checkItemIdMiddleware = PlatformTest.get<CheckItemIdMiddleware>(CheckItemIdMiddleware);
    const itemId = "itemId";
    const itemIdInBody = "itemId";

    // WHEN
    let actualError;
    try {
      await checkItemIdMiddleware.use(itemId, itemIdInBody);
    } catch (e) {
      actualError = e;
    }

    // THEN
    expect(actualError).toBeInstanceOf(BadRequest);
  });
  it("should not throw BadRequest error if item id does match id in param and is objectid", async () => {
    // GIVEN
    const checkItemIdMiddleware = PlatformTest.get<CheckItemIdMiddleware>(CheckItemIdMiddleware);
    const itemId = "5fb19cc8f7fc027056ac2e5d";
    const itemIdInBody = "5fb19cc8f7fc027056ac2e5d";

    // WHEN
    let actualError;
    try {
      await checkItemIdMiddleware.use(itemId, itemIdInBody);
    } catch (e) {
      actualError = e;
    }

    // THEN
    expect(actualError).toBeUndefined();
  });
});
