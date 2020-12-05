import {PlatformTest} from "@tsed/common";
import {StoreService} from "./StoreService";
import {Store} from "../models/Store";
import {BadRequest, Forbidden, NotFound} from "@tsed/exceptions";
import {StoreItem} from "../models/StoreItem";
import {Product} from "../models/Product";
import {ProductsService} from "./ProductsService";

describe("StoreService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  afterEach(() => jest.resetAllMocks());
  describe("save()", () => {
    async function getStoreService(locals: any[]) {
      const prototype = {
        save: jest.fn()
      };
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
    it("should save store", async () => {
      // GIVEN
      const store = new Store();
      store.items = [];

      const {storeService, prototype} = await getStoreService([]);

      // WHEN
      await storeService.save(store);

      // THEN
      // @ts-ignore
      expect(prototype.save).toHaveBeenCalled();
    });
  });
  describe("getUserStore()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    it("should return a store", async () => {
      // GIVEN
      const store = {
        findOne: jest.fn().mockReturnValue({
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
      const result = await storeService.getUserStore("1234");

      // THEN
      expect(result).toEqual({id: "1234"});
      expect(store.findOne).toHaveBeenCalledWith({users: "1234"});
    });
    it("should throw notfound if user does not have store", async () => {
      // GIVEN
      const store = {
        findOne: jest.fn().mockReturnValue({
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
        await storeService.getUserStore("1234");
      } catch (err) {
        actualError = err;
      }

      // THEN
      expect(actualError).toBeInstanceOf(NotFound);
      expect(store.findOne).toHaveBeenCalledWith({users: "1234"});
    });
  });
  describe("addStoreForUser()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    it("should add user to store if already exist", async () => {
      // GIVEN
      const storeToAdd = new Store();
      storeToAdd._id = "1234";
      storeToAdd.items = [];
      storeToAdd.users = ["otherUserId"];

      const updatedStore = {...storeToAdd, users: ["otherUserId", "userId"]};

      const saveSpy = jest.fn();
      const storeModel = jest.fn().mockImplementation((item) => {
        return {
          ...item,
          save: saveSpy
        };
      });

      // @ts-ignore
      storeModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      });
      // @ts-ignore
      storeModel.findOneAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedStore)
      });

      const storeService = await PlatformTest.invoke(StoreService, [
        {
          token: Store,
          use: storeModel
        }
      ]);

      // WHEN
      const result = await storeService.addStoreForUser("userId", storeToAdd);

      // THEN
      // @ts-ignore
      expect(storeModel.findOne).toHaveBeenCalledWith({users: "userId"});
      // @ts-ignore
      expect(storeModel.findOneAndUpdate).toHaveBeenCalledWith({_id: "1234"}, {$push: {users: "userId"}}, {new: true, upsert: false});
      expect(saveSpy).not.toHaveBeenCalled();
      expect(result).toEqual(updatedStore);
    });
    it("should add user to store if not already exist", async () => {
      // GIVEN
      const storeToAdd = new Store();
      storeToAdd._id = "1234";
      storeToAdd.items = [];
      storeToAdd.users = ["otherUserId"];

      const saveSpy = jest.fn();
      const storeModel = jest.fn().mockImplementation((item) => {
        return {
          ...item,
          save: saveSpy
        };
      });

      // @ts-ignore
      storeModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      });
      // @ts-ignore
      storeModel.findOneAndUpdate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
      });

      const storeService = await PlatformTest.invoke(StoreService, [
        {
          token: Store,
          use: storeModel
        }
      ]);

      // WHEN
      await storeService.addStoreForUser("userId", storeToAdd);

      // THEN
      // @ts-ignore
      expect(storeModel.findOne).toHaveBeenCalledWith({users: "userId"});
      // @ts-ignore
      expect(storeModel.findOneAndUpdate).toHaveBeenCalledWith({_id: "1234"}, {$push: {users: "userId"}}, {new: true, upsert: false});
      expect(saveSpy).toHaveBeenCalled();
    });
    it("should throw forbidden if user already have a store", async () => {
      // GIVEN
      const storeToAdd = new Store();
      storeToAdd._id = "1234";

      const storeModel = jest.fn().mockImplementation((item) => {
        return {
          ...item,
          save: jest.fn()
        };
      });

      // @ts-ignore
      storeModel.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(storeToAdd)
      });

      const storeService = await PlatformTest.invoke(StoreService, [
        {
          token: Store,
          use: storeModel
        }
      ]);

      // WHEN
      let actualError;
      try {
        await storeService.addStoreForUser("userId", storeToAdd);
      } catch (err) {
        actualError = err;
      }

      // THEN
      // @ts-ignore
      expect(storeModel.findOne).toHaveBeenCalledWith({users: "userId"});
      expect(actualError).toBeInstanceOf(Forbidden);
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
    it("should throw not found if shoppinglist not found", async () => {
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
    it("should throw not found if shoppinglist item not found", async () => {
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
