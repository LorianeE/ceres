import {PropertyType, Required} from "@tsed/common";
import {Model, ObjectID} from "@tsed/mongoose";
import {ShoppingItem} from "./ShoppingItem";

@Model()
export class ShoppingList {
  @ObjectID("id")
  _id: string;

  @Required()
  @PropertyType(ShoppingItem)
  items: ShoppingItem[];
}
