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
    return this.shoppingList.findById(id);
  }

  /**
   * Update or create shopping list
   * @param shoppingList
   * @returns {Promise<ShoppingList>}
   */
  async save(shoppingList: ShoppingList): Promise<ShoppingList> {
    const model = new this.shoppingList(shoppingList);

    await model.updateOne(shoppingList, {upsert: true});

    return model;
  }
}
