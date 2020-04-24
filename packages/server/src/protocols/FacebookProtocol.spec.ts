import {TestContext} from "@tsed/testing";
import User from "../models/User";
import {UsersService} from "../services/users/UsersService";
import {FacebookProtocol} from "./FacebookProtocol";

describe("FacebookProtocol", () => {
  beforeEach(() => TestContext.create());
  afterEach(() => TestContext.reset());

  describe(".$onVerify()", () => {
    it("should return a user if it exists and not create a new one", async () => {
      // GIVEN
      const request = {};
      const email = "email@domain.fr";
      const user = new User();
      user.email = email;

      const accessToken = "accessToken";
      const refreshToken = "refreshToken";
      const profile = {
        id: "facebookId",
        _json: {
          last_name: "Doe",
          first_name: "John"
        }
      };

      const usersService = {
        findOne: jest.fn().mockResolvedValue(user),
        create: jest.fn()
      };

      const protocol: FacebookProtocol = await TestContext.invoke(FacebookProtocol, [
        {
          provide: UsersService,
          use: usersService
        }
      ]);

      // WHEN
      const result = await protocol.$onVerify(request as any, [accessToken, refreshToken, profile]);

      // THEN
      expect(usersService.findOne).toHaveBeenCalledWith({facebookId: "facebookId"});
      expect(usersService.create).not.toHaveBeenCalled();
      expect(result).toEqual(user);
    });
    it("should create a user if it does not exist", async () => {
      // GIVEN
      const request = {};
      const email = "email@domain.fr";

      const accessToken = "accessToken";
      const refreshToken = "refreshToken";
      const profile = {
        id: "facebookId",
        _json: {
          last_name: "Doe",
          first_name: "John",
          emails: [
            email
          ]
        }
      };

      const expectedCreatedUser = new User();
      expectedCreatedUser.facebookId = "facebookId";
      expectedCreatedUser.firstName = "John";
      expectedCreatedUser.lastName = "Doe";
      expectedCreatedUser.email = email;

      const usersService = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(expectedCreatedUser)
      };

      const protocol: FacebookProtocol = await TestContext.invoke(FacebookProtocol, [
        {
          provide: UsersService,
          use: usersService
        }
      ]);

      // WHEN
      const result = await protocol.$onVerify(request as any, [accessToken, refreshToken, profile]);

      // THEN
      expect(usersService.findOne).toHaveBeenCalledWith({facebookId: "facebookId"});
      expect(usersService.create).toHaveBeenCalledWith(expectedCreatedUser);
      expect(result).toEqual(expectedCreatedUser);
    });
    it("should create a user if it does not exist (with no email)", async () => {
      // GIVEN
      const request = {};

      const accessToken = "accessToken";
      const refreshToken = "refreshToken";
      const profile = {
        id: "facebookId",
        _json: {
          last_name: "Doe",
          first_name: "John"
        }
      };

      const expectedCreatedUser = new User();
      expectedCreatedUser.facebookId = "facebookId";
      expectedCreatedUser.firstName = "John";
      expectedCreatedUser.lastName = "Doe";
      expectedCreatedUser.email = "";

      const usersService = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(expectedCreatedUser)
      };

      const protocol: FacebookProtocol = await TestContext.invoke(FacebookProtocol, [
        {
          provide: UsersService,
          use: usersService
        }
      ]);

      // WHEN
      const result = await protocol.$onVerify(request as any, [accessToken, refreshToken, profile]);

      // THEN
      expect(usersService.findOne).toHaveBeenCalledWith({facebookId: "facebookId"});
      expect(usersService.create).toHaveBeenCalledWith(expectedCreatedUser);
      expect(result).toEqual(expectedCreatedUser);
    });
  });
});
