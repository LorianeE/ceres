import {PlatformTest} from "@tsed/common";
import {StoreController} from "./StoreController";
import {StoreService} from "../services/StoreService";
import {Store} from "../models/Store";
import {StoreItem} from "../models/StoreItem";
import {NotFound} from "@tsed/exceptions";

describe("StoreController", () => {
  describe("getStore()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    it("should return a result from storeService", async () => {
      // GIVEN
      const storeService = {
        find: jest.fn().mockResolvedValue({id: "1", items: []})
      };

      const storeCtrl = await PlatformTest.invoke(StoreController, [
        {
          token: StoreService,
          use: storeService
        }
      ]);

      // WHEN
      const result = await storeCtrl.getStore("storeId");

      // THEN
      expect(result).toEqual({id: "1", items: []});
      expect(storeService.find).toHaveBeenCalledTimes(1);
      expect(storeService.find).toHaveBeenCalledWith("storeId");
    });
    it("should throw notfound if store not found", async () => {
      // GIVEN
      const storeService = {
        find: jest.fn().mockResolvedValue(null)
      };

      const storeCtrl = await PlatformTest.invoke(StoreController, [
        {
          token: StoreService,
          use: storeService
        }
      ]);

      // WHEN
      let actualError;
      try {
        await storeCtrl.getStore("storeId");
      } catch (err) {
        actualError = err;
      }

      // THEN
      expect(actualError).toBeInstanceOf(NotFound);
    });
  });
  describe("addStoreItem()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());

    it("should return a new item", async () => {
      // GIVEN
      const store = new Store();
      store._id = "1234";
      store.items = [];

      const item = new StoreItem();
      item.product = "productId";
      item.quantity = 2;

      const addedItem = {
        id: "itemId",
        ...item
      };

      const storeService = {
        addItemToStore: jest.fn().mockResolvedValue(addedItem)
      };

      const storeCtrl = await PlatformTest.invoke(StoreController, [
        {
          token: StoreService,
          use: storeService
        }
      ]);

      // WHEN
      const result = await storeCtrl.addStoreItem(store._id, item);

      // THEN
      expect(storeService.addItemToStore).toHaveBeenCalledTimes(1);
      expect(storeService.addItemToStore).toHaveBeenCalledWith(store._id, item);
      expect(result).toEqual(addedItem);
    });
  });
  describe("updateStoreItem()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    it("should return a result from storeService if ok", async () => {
      // GIVEN
      const item = new StoreItem();
      item._id = "itemId";
      item.product = "productId";
      item.quantity = 2;

      const store = new Store();
      store._id = "1234";
      store.items = [item];

      const updatedItem = {
        ...item,
        quantity: 3
      };

      const storeService = {
        updateStoreItem: jest.fn().mockResolvedValue(updatedItem)
      };

      const storeCtrl = await PlatformTest.invoke(StoreController, [
        {
          token: StoreService,
          use: storeService
        }
      ]);

      // WHEN
      const result = await storeCtrl.updateStoreItem("1234", item);

      // THEN
      expect(storeService.updateStoreItem).toHaveBeenCalledTimes(1);
      expect(storeService.updateStoreItem).toHaveBeenCalledWith("1234", item);
      expect(result).toEqual(updatedItem);
    });
  });
  describe("removeStoreItem()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    it("should call removeStoreItem method from storeService", async () => {
      // GIVEN
      const item = new StoreItem();
      item._id = "itemId";

      const store = new Store();
      store._id = "1234";

      const storeService = {
        removeStoreItem: jest.fn()
      };

      const storeCtrl = await PlatformTest.invoke(StoreController, [
        {
          token: StoreService,
          use: storeService
        }
      ]);

      // WHEN
      await storeCtrl.removeStoreItem(store._id, item._id);

      // THEN
      expect(storeService.removeStoreItem).toHaveBeenCalledTimes(1);
      expect(storeService.removeStoreItem).toHaveBeenCalledWith("1234", "itemId");
    });
  });
});
