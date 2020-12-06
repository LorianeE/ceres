import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {Store} from "../models/Store";
import {StoreItem} from "../models/StoreItem";
import {BadRequest, Forbidden, NotFound} from "@tsed/exceptions";
import {ProductsService} from "./ProductsService";

@Service()
export class StoreService {
  @Inject(Store)
  private store: MongooseModel<Store>;
  @Inject(StoreItem)
  private storeItem: MongooseModel<StoreItem>;
  @Inject(ProductsService)
  private productService: ProductsService;

  async save(store: Store): Promise<Store> {
    const storeModel = new this.store(store);
    return storeModel.save();
  }

  async getUserStore(userId: string): Promise<Store | null> {
    return this.store.findOne({users: userId}).exec();
  }

  async addStoreForUser(userId: string, store: Store): Promise<Store> {
    // Check if user already have a store
    const userStore = await this.store.findOne({users: userId}).exec();
    if (userStore) {
      throw new Forbidden("User already have a store.");
    }

    const storeModel = new this.store(store);
    const dbStore = await this.store.findOneAndUpdate({_id: storeModel._id}, {$push: {users: userId}}, {new: true, upsert: false}).exec();
    if (!dbStore) {
      // store did not exist
      storeModel.users.push(userId);
      await storeModel.save();
      return storeModel;
    }
    return dbStore;
  }

  async getItemFromStoreByProductId(storeId: string, productId: string): Promise<StoreItem | undefined> {
    const store = await this.store.findById(storeId).exec();
    if (!store) {
      throw new NotFound("Store not found");
    }
    return store.items.find((item) => item.product.toString() === productId);
  }

  async addItemToStore(storeId: string, item: StoreItem): Promise<StoreItem> {
    // First check if product is valid
    const product = await this.productService.findById(item.product.toString());
    if (!product) {
      throw new BadRequest("Product id from item is invalid.");
    }
    // Then push new item
    const itemModel = new this.storeItem(item);
    await this.store.findByIdAndUpdate(storeId, {$push: {items: itemModel}}).exec();
    return itemModel;
  }

  async updateStoreItem(storeId: string, item: StoreItem): Promise<StoreItem | null> {
    const store = await this.store.findById(storeId).exec();
    if (!store) {
      throw new NotFound("Store not found.");
    }
    if (!store.items.find((e) => e._id.toString() === item._id.toString())) {
      throw new NotFound("Given item not found in store.");
    }

    if (item.quantity > 0) {
      const itemModel = new this.storeItem(item);
      store.items = store.items.map((e) => (e._id.toString() === item._id.toString() ? itemModel : e));
      await store.save();
      return itemModel;
    } else {
      store.items = store.items.filter((e) => e._id.toString() !== item._id.toString());
      await store.save();
      return null;
    }
  }

  async removeStoreItem(storeId: string, itemId: string): Promise<void> {
    await this.store
      .findByIdAndUpdate(storeId, {
        $pull: {
          items: {_id: itemId}
        }
      })
      .exec();
  }
}
