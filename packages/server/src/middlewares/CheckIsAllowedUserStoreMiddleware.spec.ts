import {PlatformTest} from "@tsed/common";
import {CheckIsAllowedUserStoreMiddleware} from "./CheckIsAllowedUserStoreMiddleware";
import {User} from "../models/User";
import {Unauthorized} from "@tsed/exceptions";
import {UsersService} from "../services/users/UsersService";

describe("CheckIsAllowedUserStoreMiddleware", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  const user = new User();
  user._id = "userId";

  it("should throw Unauthorized error if user's store does not match given store id", async () => {
    // GIVEN
    const storeId = "551137c2f9e1fac808a5f572";
    const usersService = {
      findOne: jest.fn().mockResolvedValue({id: "123", store: "storeId"})
    };
    const checkIsAllowedUserMiddleware = await PlatformTest.invoke(CheckIsAllowedUserStoreMiddleware, [
      {
        token: UsersService,
        use: usersService
      }
    ]);

    // WHEN
    let actualError;
    try {
      await checkIsAllowedUserMiddleware.use(storeId, user);
    } catch (e) {
      actualError = e;
    }

    // THEN
    expect(actualError).toBeInstanceOf(Unauthorized);
  });
  it("should not throw Unauthorized if user's store id does match given store id", async () => {
    // GIVEN
    const storeId = "551137c2f9e1fac808a5f572";
    const usersService = {
      findOne: jest.fn().mockResolvedValue({id: "123", store: "551137c2f9e1fac808a5f572"})
    };
    const checkIsAllowedUserMiddleware = await PlatformTest.invoke(CheckIsAllowedUserStoreMiddleware, [
      {
        token: UsersService,
        use: usersService
      }
    ]);

    // WHEN
    let actualError;
    try {
      await checkIsAllowedUserMiddleware.use(storeId, user);
    } catch (e) {
      actualError = e;
    }

    // THEN
    expect(actualError).toBeUndefined();
  });
});
