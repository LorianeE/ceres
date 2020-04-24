import {inject, TestContext} from "@tsed/testing";
import {PassportFacebookCtrl} from "./PassportFacebookCtrl";
import User from "../../models/User";

describe("PassportFacebookCtrl", () => {
  describe("authenticate()", () => {
    beforeEach(() => TestContext.create());
    afterEach(() => TestContext.reset());

    it("should return user", inject([PassportFacebookCtrl], async (passportFacebookCtrl: PassportFacebookCtrl) => {
      // GIVEN
      const user = new User();
      user._id = "12345";

      // WHEN
      const result = await passportFacebookCtrl.authenticate(user);

      // THEN
      expect(result).toEqual(user);
    }));
  });
  describe("callback()", () => {
    beforeEach(() => TestContext.create());
    afterEach(() => TestContext.reset());

    it("should return user", inject([PassportFacebookCtrl], async (passportFacebookCtrl: PassportFacebookCtrl) => {
      // GIVEN
      const user = new User();
      user._id = "12345";

      // WHEN
      const result = await passportFacebookCtrl.callback(user);

      // THEN
      expect(result).toEqual(user);
    }));
  });
});
