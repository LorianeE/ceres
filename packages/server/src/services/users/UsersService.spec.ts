import {TestContext} from "@tsed/testing";
import User from "../../models/User";
import {UsersService} from "./UsersService";
import {NotFound} from "ts-httpexceptions";

async function getUsersService(locals: any[]) {
  const prototype = {
    save: jest.fn().mockReturnThis(),
    updateOne: jest.fn().mockReturnThis()
  };
  const userModel = jest.fn().mockImplementation(() => {
    return prototype;
  });
  // @ts-ignore
  userModel.findOne = jest.fn();
  // @ts-ignore
  userModel.findById = jest.fn();
  locals.push({
    token: User,
    use: userModel
  });

  return {
    usersService: await TestContext.invoke(UsersService, locals) as UsersService,
    userModel,
    prototype
  };
}

describe("UsersService", () => {
  beforeEach(() => TestContext.create());
  afterEach(() => TestContext.reset());

  describe("findOne()", () => {
    beforeEach(() => TestContext.create());
    afterEach(() => TestContext.reset());
    it("should return a specific user", async () => {
      // GIVEN
      const user = new User();
      user.firstName = "John";
      user.lastName = "Doe";
      user.facebookId = "facebookId";

      const {usersService, userModel, prototype} = await getUsersService([]);

      // @ts-ignore
      userModel.findOne = jest.fn().mockResolvedValue(user);

      // WHEN
      const result = await usersService.findOne({facebookId: "facebookId"});

      // THEN
      expect(result).toEqual(user);
      // @ts-ignore
      expect(userModel.findOne).toHaveBeenCalled();
      expect(usersService).toBeInstanceOf(UsersService);
    });
  });
  describe("create()", () => {
    it("should create user", async () => {
      // GIVEN
      const user = new User();
      user.firstName = "John";
      user.lastName = "Doe";
      user.facebookId = "facebookId";

      const {usersService, userModel, prototype} = await getUsersService([]);

      // WHEN
      await usersService.create(user);

      // THEN
      expect(userModel).toHaveBeenCalledWith(user);
      expect(prototype.save).toHaveBeenCalledWith();
      expect(prototype.save).toHaveBeenCalledTimes(1);
    });
  });
  describe("addShoppingListId()", () => {
    it("should add shopping list id to user's shopping list ids", async () => {
      // GIVEN
      const user = new User();
      user.firstName = "John";
      user.lastName = "Doe";
      user.facebookId = "facebookId";
      user.shoppingListIds = [];

      const {usersService, userModel, prototype} = await getUsersService([]);

      // @ts-ignore
      userModel.findById = jest.fn().mockResolvedValue(user);

      // WHEN
      await usersService.addShoppingListId(user, "1234");

      // THEN
      expect(userModel).toHaveBeenCalledWith(user);
      // @ts-ignore
      expect(userModel.findById).toHaveBeenCalled();
      expect(prototype.updateOne).toHaveBeenCalledTimes(1);
    });
    it("should throw error if user not found", async () => {
      // GIVEN
      const user = new User();
      user.firstName = "John";
      user.lastName = "Doe";
      user.facebookId = "facebookId";
      user.shoppingListIds = [];

      const {usersService, userModel, prototype} = await getUsersService([]);

      // @ts-ignore
      userModel.findById = jest.fn().mockResolvedValue(null);

      // WHEN
      let actualError;
      try {
        await usersService.addShoppingListId(user, "1234");
      } catch (err) {
        actualError = err;
      }

      // THEN
      // @ts-ignore
      expect(userModel.findById).toHaveBeenCalled();
      expect(prototype.updateOne).not.toHaveBeenCalled();
      expect(actualError).toBeInstanceOf(NotFound);
    });
  });
});
