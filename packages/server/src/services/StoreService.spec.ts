import {PlatformTest} from "@tsed/common";
import {StoreService} from "./StoreService";
import {Store} from "../models/Store";
import {BadRequest, NotFound} from "@tsed/exceptions";
import {StoreItem} from "../models/StoreItem";
import {Product} from "../models/Product";
import {ProductsService} from "./ProductsService";

describe("StoreService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  afterEach(() => jest.resetAllMocks());
  describe("save()", () => {
    async function getStoreService(locals: any[]) {
      const prototype = {};
      const storeModel = jest.fn().mockImplementation(() => {
        return prototype;
      });
      // @ts-ignore
      storeModel.findOneAndUpdate = jest.fn().mockReturnValue({exec: () => jest.fn()});
      locals.push({
        token: Store,
        use: storeModel
      });

      return {
        storeService: (await PlatformTest.invoke(StoreService, locals)) as StoreService,
        storeModel,
        prototype
      };
    }
    it("should save store without _id", async () => {
      // GIVEN
      const store = new Store();
      store.items = [];

      const {storeService, storeModel} = await getStoreService([]);

      // WHEN
      await storeService.save(store);

      // THEN
      // @ts-ignore
      expect(storeModel.findOneAndUpdate).toHaveBeenCalledWith(expect.anything(), store, {upsert: true, new: true});
    });
  });
  describe("find()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());

    it("should return a specific shopping list", async () => {
      // GIVEN
      const store = {
        findById: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({id: "1234"})
        })
      };

      const storeService = await PlatformTest.invoke(StoreService, [
        {
          token: Store,
          use: store
        }
      ]);

      // WHEN
      const result = await storeService.find("1234");

      // THEN
      expect(result).toEqual({id: "1234"});
      expect(store.findById).toHaveBeenCalled();

      expect(storeService).toBeInstanceOf(StoreService);
    });
  });
  describe("getItemFromStoreByProductId()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    it("should return a item from store", async () => {
      // GIVEN
      const store = {
        findById: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({id: "1234", items: [{_id: "itemId", product: "productId"}]})
        })
      };

      const storeService = await PlatformTest.invoke(StoreService, [
        {
          token: Store,
          use: store
        }
      ]);

      // WHEN
      const result = await storeService.getItemFromStoreByProductId("storeId", "productId");

      // THEN
      expect(result).toEqual({_id: "itemId", product: "productId"});
      expect(store.findById).toHaveBeenCalledWith("storeId");
    });
    it("should throw notfound if store not found", async () => {
      // GIVEN
      const store = {
        findById: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null)
        })
      };

      const storeService = await PlatformTest.invoke(StoreService, [
        {
          token: Store,
          use: store
        }
      ]);

      // WHEN
      let actualError;
      try {
        await storeService.getItemFromStoreByProductId("storeId", "productId");
      } catch (err) {
        actualError = err;
      }

      // THEN
      expect(actualError).toBeInstanceOf(NotFound);
      expect(store.findById).toHaveBeenCalledWith("storeId");
    });
  });
  describe("addItemToStore()", () => {
    it("should add item to store if found", async () => {
      // GIVEN
      const item = new StoreItem();
      item._id = "itemId";
      item.product = "productId";
      item.quantity = 1;

      // GIVEN
      const storeModel = {
        findByIdAndUpdate: jest.fn().mockReturnValue({
          exec: jest.fn()
        })
      };
      const storeItemModel = jest.fn().mockImplementation(() => {
        return item;
      });

      const productsService = {
        findById: jest.fn().mockReturnValue(new Product())
      };

      const storeService = await PlatformTest.invoke(StoreService, [
        {
          token: Store,
          use: storeModel
        },
        {
          token: StoreItem,
          use: storeItemModel
        },
        {
          token: ProductsService,
          use: productsService
        }
      ]);

      // WHEN
      const result = await storeService.addItemToStore("1234", item);

      // THEN
      expect(result).toEqual(item);
      expect(storeModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(storeModel.findByIdAndUpdate).toHaveBeenCalledWith("1234", {$push: {items: item}});
    });
    it("should throw BadRequest if product is not found", async () => {
      // GIVEN
      const item = new StoreItem();
      item._id = "itemId";
      item.product = "productId";
      item.quantity = 1;

      // GIVEN
      const productService = {
        findById: jest.fn().mockReturnValue(null)
      };

      const storeService = await PlatformTest.invoke(StoreService, [
        {
          token: ProductsService,
          use: productService
        }
      ]);

      // WHEN
      let actualErr;
      try {
        await storeService.addItemToStore("1234", item);
      } catch (err) {
        actualErr = err;
      }

      // THEN
      expect(actualErr).toBeInstanceOf(BadRequest);
    });
  });
  describe("updateStoreItem()", () => {
    async function getStoreService(locals: any[], itemsInStore: any[], findByIdFound: boolean = true) {
      const prototype = {};
      const storeModel = jest.fn().mockImplementation(() => {
        return prototype;
      });
      const storeItemModel = jest.fn().mockImplementation((item) => {
        return item;
      });
      // @ts-ignore
      storeModel.findOneAndUpdate = jest.fn().mockReturnValue({exec: () => jest.fn()});
      const saveSpy = jest.fn();
      if (findByIdFound) {
        // @ts-ignore
        storeModel.findById = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({id: "1234", items: itemsInStore, save: saveSpy})
        });
      } else {
        // @ts-ignore
        storeModel.findById = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null)
        });
      }

      locals.push({
        token: Store,
        use: storeModel
      });
      locals.push({
        token: StoreItem,
        use: storeItemModel
      });

      return {
        storeService: (await PlatformTest.invoke(StoreService, locals)) as StoreService,
        storeModel,
        storeItemModel,
        saveSpy
      };
    }
    it("should update item from store if found", async () => {
      // GIVEN
      const store = new Store();
      store._id = "storeId";
      store.items = [];
      const item = new StoreItem();
      item._id = "itemId";
      item.product = "productId";
      item.quantity = 1;
      const item2 = new StoreItem();
      item2._id = "itemId2";
      item2.product = "productId2";
      item2.quantity = 2;

      const {storeService, storeModel, saveSpy} = await getStoreService([], [item, item2]);

      // WHEN
      const result = await storeService.updateStoreItem("storeId", item);

      // THEN
      // @ts-ignore
      expect(storeModel.findById).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalled();
      expect(result).toEqual(item);
    });
    it("should delete item from store if found but quantity <= 0", async () => {
      // GIVEN
      const store = new Store();
      store._id = "storeId";
      store.items = [];
      const item = new StoreItem();
      item._id = "itemId";
      item.product = "productId";
      item.quantity = 0;
      const item2 = new StoreItem();
      item2._id = "itemId2";
      item2.product = "productId2";
      item2.quantity = 2;

      const {storeService, storeModel, saveSpy} = await getStoreService([], [item, item2]);

      // WHEN
      const result = await storeService.updateStoreItem("storeId", item);

      // THEN
      // @ts-ignore
      expect(storeModel.findById).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalled();
      expect(result).toBeNull();
    });
    it("should throw not found if store not found", async () => {
      // GIVEN
      const store = new Store();
      store._id = "storeId";
      store.items = [];
      const item = new StoreItem();
      item._id = "itemId";
      item.product = "productId";
      item.quantity = 1;

      const {storeService, storeModel, saveSpy} = await getStoreService([], [item], false);

      let actualError;
      // WHEN
      try {
        await storeService.updateStoreItem("storeId", item);
      } catch (err) {
        actualError = err;
      }

      // THEN
      // @ts-ignore
      expect(storeModel.findById).toHaveBeenCalled();
      expect(actualError).toBeInstanceOf(NotFound);
      expect(actualError.message).toBe("Store not found.");
      expect(saveSpy).not.toHaveBeenCalled();
    });
    it("should throw not found if store item not found", async () => {
      // GIVEN
      const store = new Store();
      store._id = "storeId";
      store.items = [];
      const item = new StoreItem();
      item._id = "itemId";
      item.product = "productId";
      item.quantity = 1;

      const {storeService, storeModel, saveSpy} = await getStoreService([], []);

      let actualError;
      // WHEN
      try {
        await storeService.updateStoreItem("storeId", item);
      } catch (err) {
        actualError = err;
      }

      // THEN
      // @ts-ignore
      expect(storeModel.findById).toHaveBeenCalled();
      expect(actualError).toBeInstanceOf(NotFound);
      expect(actualError.message).toBe("Given item not found in store.");
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });
  describe("removeStoreItem()", () => {
    it("should delete item from store", async () => {
      // GIVEN
      const item = new StoreItem();
      item._id = "itemId";

      // GIVEN
      const storeModel = {
        findByIdAndUpdate: jest.fn().mockReturnValue({
          exec: jest.fn()
        })
      };

      const storeService = await PlatformTest.invoke(StoreService, [
        {
          token: Store,
          use: storeModel
        }
      ]);

      // WHEN
      await storeService.removeStoreItem("1234", item._id);

      // THEN
      expect(storeModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(storeModel.findByIdAndUpdate).toHaveBeenCalledWith("1234", {
        $pull: {
          items: {_id: item._id}
        }
      });
    });
  });
});
