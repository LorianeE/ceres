import {inject, TestContext} from "@tsed/testing";
import {LoginCtrl} from "./LoginCtrl";
import User from "../../models/User";

describe("LoginCtrl", () => {
  describe("getAuthenticatedUser()", () => {
    beforeEach(() => TestContext.create());
    afterEach(() => TestContext.reset());

    it("should return user if authenticated", inject([LoginCtrl], async (loginCtrl: LoginCtrl) => {
      // GIVEN
      const user = new User();
      user._id = "12345";

      const req: any = {
        isAuthenticated: () => true,
        user
      };

      // WHEN
      const result = await loginCtrl.getAuthenticatedUser(req);

      // THEN
      expect(result).toEqual(user);
    }));

    it("should return null if user not authenticated", inject([LoginCtrl], async (loginCtrl: LoginCtrl) => {
      // GIVEN
      const req: any = {
        isAuthenticated: () => false
      };

      // WHEN
      const result = await loginCtrl.getAuthenticatedUser(req);

      // THEN
      expect(result).toEqual(null);
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
