import {inject, TestContext} from "@tsed/testing";
import {LoginCtrl} from "./LoginCtrl";
import User from "../../models/User";
import {UsersService} from "../../services/users/UsersService";
import {Unauthorized} from "ts-httpexceptions";

describe("LoginCtrl", () => {
  describe("getAuthenticatedUser()", () => {
    beforeEach(() => TestContext.create());
    afterEach(() => TestContext.reset());

    it("should return user if authenticated", async () => {
      // GIVEN
      const user = new User();
      user._id = "12345";

      const req: any = {
        isAuthenticated: () => true,
        user
      };

      const usersService = {
        findOne: jest.fn().mockResolvedValue({id: "1", shoppingLists: ["1234"]}),
      };

      const loginCtrl = await TestContext.invoke(LoginCtrl, [
        {
          provide: UsersService,
          use: usersService,
        },
      ]);

      // WHEN
      const result = await loginCtrl.getAuthenticatedUser(req, user);

      // THEN
      expect(result).toEqual({
        id: "1",
        shoppingLists: ["1234"]
      });
    });

    it("should return throw unauthorized if user not authenticated", inject([LoginCtrl], async (loginCtrl: LoginCtrl) => {
      // GIVEN
      const req: any = {
        isAuthenticated: () => false
      };
      // @ts-ignore
      const user: User = {};

      // WHEN
      let actualError;
      try {
        await loginCtrl.getAuthenticatedUser(req, user);
      } catch (err) {
        actualError = err;
      }

      // THEN
      expect(actualError).toBeInstanceOf(Unauthorized);
    }));
  });
  describe("logout()", () => {
    beforeEach(() => TestContext.create());
    afterEach(() => TestContext.reset());

    it("should return user", inject([LoginCtrl], async (loginCtrl: LoginCtrl) => {
      // GIVEN
      const req: any = {
        logout: jest.fn()
      };

      // WHEN
      const result = await loginCtrl.logout(req);

      // THEN
      expect(req.logout).toHaveBeenCalled();
    }));
  });
});
