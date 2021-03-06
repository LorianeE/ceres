import mongoose from "mongoose";
import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {ShoppingList} from "../models/ShoppingList";
import {ShoppingItem} from "../models/ShoppingItem";
import {BadRequest, NotFound} from "@tsed/exceptions";
import {ProductsService} from "./ProductsService";

@Service()
export class ShoppingListService {
  @Inject(ShoppingList)
  private shoppingList: MongooseModel<ShoppingList>;
  @Inject(ShoppingItem)
  private shoppingItem: MongooseModel<ShoppingItem>;
  @Inject(ProductsService)
  private productService: ProductsService;

  /**
   * Find a shoppingList by its ID.
   * @param id
   * @returns {null|ShoppingList}
   */
  async find(id: string): Promise<ShoppingList | null> {
    return this.shoppingList.findById(id).exec();
  }

  /**
   * Update or create shopping list
   * @param shoppingList
   * @returns {Promise<ShoppingList>}
   */
  async save(shoppingList: ShoppingList): Promise<ShoppingList> {
    if (!shoppingList._id) {
      // We have to create an _id if it is null so that findOneAndUpdate won't save a shoppingList with _id: null.
      // We could use findByIdAndUpdate and not have the problem but it seems to be a typescript issue with it.
      shoppingList._id = mongoose.Types.ObjectId().toString();
    }
    return this.shoppingList
      .findOneAndUpdate({_id: shoppingList._id}, shoppingList, {
        upsert: true,
        new: true
      })
      .exec();
  }

  async getItem(shoppingListId: string, itemId: string): Promise<ShoppingItem | null> {
    const shoppingList = await this.find(shoppingListId);
    if (!shoppingList) {
      return null;
    }
    return shoppingList.items.find((item) => item._id.toString() === itemId) || null;
  }

  async addItem(shoppingListId: string, item: ShoppingItem): Promise<ShoppingItem> {
    // First check if product is valid
    const product = await this.productService.findById(item.product.toString());
    if (!product) {
      throw new BadRequest("Product id from item is invalid.");
    }
    // Then push new item
    const itemModel = new this.shoppingItem(item);
    await this.shoppingList.findByIdAndUpdate(shoppingListId, {$push: {items: itemModel}}).exec();
    return itemModel;
  }

  async updateItem(shoppingListId: string, item: ShoppingItem): Promise<ShoppingItem | null> {
    const shoppingList = await this.shoppingList.findById(shoppingListId).exec();
    if (!shoppingList) {
      throw new NotFound("Shopping list not found.");
    }
    if (!shoppingList.items.find((e) => e._id.toString() === item._id.toString())) {
      throw new NotFound("Given item not found in shopping list.");
    }

    if (item.quantity > 0) {
      const itemModel = new this.shoppingItem(item);
      shoppingList.items = shoppingList.items.map((e) => (e._id.toString() === item._id.toString() ? itemModel : e));
      await shoppingList.save();
      return itemModel;
    } else {
      shoppingList.items = shoppingList.items.filter((e) => e._id.toString() !== item._id.toString());
      await shoppingList.save();
      return null;
    }
  }

  async deleteItem(shoppingListId: string, itemId: string): Promise<void> {
    await this.shoppingList
      .findByIdAndUpdate(shoppingListId, {
        $pull: {
          items: {_id: itemId}
        }
      })
      .exec();
  }
}
