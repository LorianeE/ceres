import {PlatformTest} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {CheckUserExistsMiddleware} from "./CheckUserExistsMiddleware";
import {UsersService} from "../services/users/UsersService";

describe("CheckUserExistsMiddleware", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  const userId = "userId";

  it("should throw Not Found error if user does not exist", async () => {
    // GIVEN
    const usersService = {
      findOne: jest.fn().mockResolvedValue(null)
    };
    const checkUserExistsMiddleware = await PlatformTest.invoke(CheckUserExistsMiddleware, [
      {
        token: UsersService,
        use: usersService
      }
    ]);

    // WHEN
    let actualError;
    try {
      await checkUserExistsMiddleware.use(userId);
    } catch (e) {
      actualError = e;
    }

    // THEN
    expect(actualError).toBeInstanceOf(NotFound);
  });
  it("should not throw NotFound if user exists", async () => {
    // GIVEN
    const usersService = {
      findOne: jest.fn().mockResolvedValue({id: "userId"})
    };
    const checkUserExistsMiddleware = await PlatformTest.invoke(CheckUserExistsMiddleware, [
      {
        token: UsersService,
        use: usersService
      }
    ]);

    // WHEN
    let actualError;
    try {
      await checkUserExistsMiddleware.use(userId);
    } catch (e) {
      actualError = e;
    }

    // THEN
    expect(actualError).toBeUndefined();
  });
});
