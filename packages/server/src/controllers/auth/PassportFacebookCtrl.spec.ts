import {PlatformTest} from "@tsed/common";
import {PassportFacebookCtrl} from "./PassportFacebookCtrl";
import {User} from "../../models/User";

describe("PassportFacebookCtrl", () => {
  describe("authenticate()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());

    it(
      "should return user",
      PlatformTest.inject([PassportFacebookCtrl], async (passportFacebookCtrl: PassportFacebookCtrl) => {
        // GIVEN
        const user = new User();
        user._id = "12345";

        // WHEN
        const result = await passportFacebookCtrl.authenticate(user);

        // THEN
        expect(result).toEqual(user);
      })
    );
  });
  describe("callback()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());

    it(
      "should return user",
      PlatformTest.inject([PassportFacebookCtrl], async (passportFacebookCtrl: PassportFacebookCtrl) => {
        // GIVEN
        const user = new User();
        user._id = "12345";

        // WHEN
        const result = await passportFacebookCtrl.callback(user);

        // THEN
        expect(result).toEqual(user);
      })
    );
  });
});
