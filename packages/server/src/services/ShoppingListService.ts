import * as mongoose from "mongoose";
import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {ShoppingList} from "../models/ShoppingList";

@Service()
export class ShoppingListService {
  @Inject(ShoppingList)
  private shoppingList: MongooseModel<ShoppingList>;

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
    return this.shoppingList.findOneAndUpdate({_id: shoppingList._id}, shoppingList, {upsert: true, new: true}).exec();
  }
}
