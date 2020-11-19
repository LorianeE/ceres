import {PlatformTest} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import User from "../../models/User";
import {UsersService} from "./UsersService";

async function getUsersService(locals: any[]) {
  const prototype = {
    save: jest.fn().mockReturnThis()
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
    usersService: (await PlatformTest.invoke(UsersService, locals)) as UsersService,
    userModel,
    prototype
  };
}

describe("UsersService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("findOne()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    it("should return a specific user", async () => {
      // GIVEN
      const user = new User();
      user.firstName = "John";
      user.lastName = "Doe";
      user.facebookId = "facebookId";

      const {usersService, userModel} = await getUsersService([]);

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
  describe("addShoppingList()", () => {
    it("should add shopping list id to user's shopping list ids", async () => {
      // GIVEN
      const user = new User();
      user.firstName = "John";
      user.lastName = "Doe";
      user.facebookId = "facebookId";
      user.shoppingLists = [];

      const save = jest.fn();

      const {usersService, userModel} = await getUsersService([]);

      // @ts-ignore
      userModel.findById = jest.fn().mockResolvedValue({...user, save});

      // WHEN
      await usersService.addShoppingList(user, "1234");

      // THEN
      // @ts-ignore
      expect(userModel.findById).toHaveBeenCalled();
      expect(save).toHaveBeenCalledTimes(1);
    });
    it("should throw error if user not found", async () => {
      // GIVEN
      const user = new User();
      user.firstName = "John";
      user.lastName = "Doe";
      user.facebookId = "facebookId";
      user.shoppingLists = [];

      const {usersService, userModel} = await getUsersService([]);

      // @ts-ignore
      userModel.findById = jest.fn().mockResolvedValue(null);

      // WHEN
      let actualError;
      try {
        await usersService.addShoppingList(user, "1234");
      } catch (err) {
        actualError = err;
      }

      // THEN
      // @ts-ignore
      expect(userModel.findById).toHaveBeenCalled();
      expect(actualError).toBeInstanceOf(NotFound);
    });
  });
});
