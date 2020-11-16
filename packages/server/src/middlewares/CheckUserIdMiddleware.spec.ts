import {PlatformTest} from "@tsed/common";
import {CheckUserIdMiddleware} from "./CheckUserIdMiddleware";
import {Unauthorized} from "@tsed/exceptions";
import {User} from "../models/User";

describe("CheckUserIdMiddleware", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should throw Unauthorized error if user id does not match authorized user id", async () => {
    // GIVEN
    const checkUserIdMiddleware = PlatformTest.get<CheckUserIdMiddleware>(CheckUserIdMiddleware);
    const userId = "userId";
    const user = new User();
    user._id = "anotherUserId";

    // WHEN
    let actualError;
    try {
      await checkUserIdMiddleware.use(userId, user);
    } catch (e) {
      actualError = e;
    }

    // THEN
    expect(actualError).toBeInstanceOf(Unauthorized);
  });
  it("should not throw Unauthorized error if user id does match authorized user id", async () => {
    // GIVEN
    const checkUserIdMiddleware = PlatformTest.get<CheckUserIdMiddleware>(CheckUserIdMiddleware);
    const userId = "userId";
    const user = new User();
    user._id = "userId";

    // WHEN
    let actualError;
    try {
      await checkUserIdMiddleware.use(userId, user);
    } catch (e) {
      actualError = e;
    }

    // THEN
    expect(actualError).toBeUndefined();
  });
});
