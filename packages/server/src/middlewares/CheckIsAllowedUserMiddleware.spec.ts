import {PlatformTest} from "@tsed/common";
import {CheckIsAllowedUserMiddleware} from "./CheckIsAllowedUserMiddleware";
import {User} from "../models/User";
import {Unauthorized} from "@tsed/exceptions";
import {UsersService} from "../services/users/UsersService";

describe("CheckIsAllowedUserMiddleware", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  const user = new User();
  user._id = "userId";

  it("should throw Unauthorized error if user's shoppinglist ids does not contain requested shoppinglist id", async () => {
    // GIVEN
    const shoppingListId = "shoppingListId3";
    const usersService = {
      findOne: jest.fn().mockResolvedValue({id: "123", shoppingLists: ["shoppingListId1", "shoppingListId2"]})
    };
    const checkIsAllowedUserMiddleware = await PlatformTest.invoke(CheckIsAllowedUserMiddleware, [
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
    const shoppingListId = "shoppingListId1";
    const usersService = {
      findOne: jest.fn().mockResolvedValue({id: "123", shoppingLists: ["shoppingListId1", "shoppingListId2"]})
    };
    const checkIsAllowedUserMiddleware = await PlatformTest.invoke(CheckIsAllowedUserMiddleware, [
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
