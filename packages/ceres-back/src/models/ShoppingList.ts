import {
  Property,
  PropertyType,
  Required
} from "@tsed/common";
import {ShoppingItem} from "./ShoppingItem";
import {Model, ObjectID} from "@tsed/mongoose";

@Model()
export class ShoppingList {
  @ObjectID("id")
  _id: string;

  @Required()
  @Property()
  @PropertyType(ShoppingItem)
  items: ShoppingItem[];

  constructor(items: ShoppingItem[]) {
    this.items = items;
  }
}
