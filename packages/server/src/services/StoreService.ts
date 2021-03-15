import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import mongoose from "mongoose";
import {Store} from "../models/Store";
import {StoreItem} from "../models/StoreItem";
import {BadRequest, NotFound} from "@tsed/exceptions";
import {ProductsService} from "./ProductsService";
import {UsersService} from "./users/UsersService";

@Service()
export class StoreService {
  @Inject(Store)
  private store: MongooseModel<Store>;
  @Inject(StoreItem)
  private storeItem: MongooseModel<StoreItem>;
  @Inject(ProductsService)
  private productService: ProductsService;
  @Inject(UsersService)
  private usersService: UsersService;

  async save(store: Store): Promise<Store> {
    if (!store._id) {
      // We have to create an _id if it is null so that findOneAndUpdate won't save a store with _id: null.
      // We could use findByIdAndUpdate and not have the problem but it seems to be a typescript issue with it.
      store._id = mongoose.Types.ObjectId().toString();
    }
    return this.store
      .findOneAndUpdate({_id: store._id}, store, {
        upsert: true,
        new: true
      })
      .exec();
  }

  async getUserStore(userId: string): Promise<Store | null> {
    const user = await this.usersService.findOne({_id: userId});
    if (user) {
      // Check if user has a store
      if (!user.store) {
        throw new NotFound("User does not have any store.");
      }
      return await this.store.findById(user.store).exec();
    }
    throw new NotFound("User not found.");
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
