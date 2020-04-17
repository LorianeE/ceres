import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {ShoppingList} from "../models/ShoppingList";

@Service()
export class ShoppingListService {
  @Inject(ShoppingList)
  private shoppingList: MongooseModel<ShoppingList>;

  /**
   * Find a shoppingList by his ID.
   * @param id
   * @returns {undefined|ShoppingList}
   */
  async find(id: string): Promise<ShoppingList | null> {
    const shoppingList = await this.shoppingList.findById(id).exec();

    return shoppingList;
  }

  /**
   *
   * @param shoppingList
   * @returns {Promise<TResult|TResult2|ShoppingList>}
   */
  async save(shoppingList: ShoppingList): Promise<ShoppingList> {
    const model = new this.shoppingList(shoppingList);

    await model.updateOne(shoppingList, {upsert: true});

    return model;
  }
}
