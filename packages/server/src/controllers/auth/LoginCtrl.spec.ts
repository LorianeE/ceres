import {LoginCtrl} from "./LoginCtrl";
import User from "../../models/User";
import {UsersService} from "../../services/users/UsersService";
import {Unauthorized} from "@tsed/exceptions";
import {PlatformTest} from "@tsed/common";

describe("LoginCtrl", () => {
  describe("getAuthenticatedUser()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());

    it("should return user if authenticated", async () => {
      // GIVEN
      const user = new User();
      user._id = "12345";

      const req: any = {
        isAuthenticated: () => true,
        user
      };

      const usersService = {
        findOne: jest.fn().mockResolvedValue({id: "1", shoppingLists: ["1234"]})
      };

      const loginCtrl = await PlatformTest.invoke(LoginCtrl, [
        {
          token: UsersService,
          use: usersService
        }
      ]);

      // WHEN
      const result = await loginCtrl.getAuthenticatedUser(req, user);

      // THEN
      expect(result).toEqual({
        id: "1",
        shoppingLists: ["1234"]
      });
    });

    it(
      "should return throw unauthorized if user not authenticated",
      PlatformTest.inject([LoginCtrl], async (loginCtrl: LoginCtrl) => {
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
      })
    );
  });
  describe("logout()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());

    it(
      "should return user",
      PlatformTest.inject([LoginCtrl], async (loginCtrl: LoginCtrl) => {
        // GIVEN
        const req: any = {
          logout: jest.fn()
        };

        // WHEN
        await loginCtrl.logout(req);

        // THEN
        expect(req.logout).toHaveBeenCalled();
      })
    );
  });
});
