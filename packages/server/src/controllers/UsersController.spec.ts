import {PlatformTest} from "@tsed/common";
import {UsersController} from "./UsersController";
import {StoreService} from "../services/StoreService";
import {Store} from "../models/Store";
import {UsersService} from "../services/users/UsersService";

describe("UsersController", () => {
  describe("addStore()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());

    it("should return a result from storeService", async () => {
      // GIVEN
      const store = new Store();
      store._id = "1234";
      store.items = [];

      const storeService = {
        save: jest.fn().mockResolvedValue(store)
      };
      const usersService = {
        addStore: jest.fn()
      };

      const usersCtrl = await PlatformTest.invoke(UsersController, [
        {
          token: StoreService,
          use: storeService
        },
        {
          token: UsersService,
          use: usersService
        }
      ]);

      // WHEN
      const result = await usersCtrl.addStore("userId", store);

      // THEN
      expect(storeService.save).toHaveBeenCalledTimes(1);
      expect(usersService.addStore).toHaveBeenCalledTimes(1);
      expect(storeService.save).toHaveBeenCalledWith(store);
      expect(usersService.addStore).toHaveBeenCalledWith("userId", store);
      expect(result).toEqual(store);
    });
  });
});
