import {PlatformTest} from "@tsed/common";
import {CheckIsAllowedUserShopListMiddleware} from "./CheckIsAllowedUserShopListMiddleware";
import {User} from "../models/User";
import {Unauthorized} from "@tsed/exceptions";
import {UsersService} from "../services/users/UsersService";

describe("CheckIsAllowedUserShopListMiddleware", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  const user = new User();
  user._id = "userId";

  it("should throw Unauthorized error if user's shoppinglist ids does not contain requested shoppinglist id", async () => {
    // GIVEN
    const shoppingListId = "551137c2f9e1fac808a5f573";
    const usersService = {
      findOne: jest.fn().mockResolvedValue({id: "123", shoppingLists: ["551137c2f9e1fac808a5f571", "551137c2f9e1fac808a5f572"]})
    };
    const checkIsAllowedUserMiddleware = await PlatformTest.invoke(CheckIsAllowedUserShopListMiddleware, [
      {
        token: UsersService,
        use: usersService
      }
    ]);

    // WHEN
    let actualError;
    try {
      await checkIsAllowedUserMiddleware.use(shoppingListId, user);
    } catch (e) {
      actualError = e;
    }

    // THEN
    expect(actualError).toBeInstanceOf(Unauthorized);
  });
  it("should not throw Unauthorized if user's shoppinglist ids does contain requested shoppinglist id", async () => {
    // GIVEN
    const shoppingListId = "551137c2f9e1fac808a5f572";
    const usersService = {
      findOne: jest.fn().mockResolvedValue({id: "123", shoppingLists: ["551137c2f9e1fac808a5f571", "551137c2f9e1fac808a5f572"]})
    };
    const checkIsAllowedUserMiddleware = await PlatformTest.invoke(CheckIsAllowedUserShopListMiddleware, [
      {
        token: UsersService,
        use: usersService
      }
    ]);

    // WHEN
    let actualError;
    try {
      await checkIsAllowedUserMiddleware.use(shoppingListId, user);
    } catch (e) {
      actualError = e;
    }

    // THEN
    expect(actualError).toBeUndefined();
  });
});
