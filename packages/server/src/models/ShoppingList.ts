import {Required, CollectionOf} from "@tsed/schema";
import {Model, ObjectID} from "@tsed/mongoose";
import {ShoppingItem} from "./ShoppingItem";

@Model()
export class ShoppingList {
  @ObjectID("id")
  _id: string;

  @Required()
  @CollectionOf(ShoppingItem)
  items: ShoppingItem[];
}
