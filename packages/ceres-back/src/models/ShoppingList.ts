import {
  PropertyType,
  Required
} from "@tsed/common";
import {ShoppingItem} from "./ShoppingItem";

export class ShoppingList {
  @Required()
  id: string;

  @Required()
  @PropertyType(ShoppingItem)
  items: ShoppingItem[];

  constructor(id: string, items: ShoppingItem[]) {
    this.id = id;
    this.items = items;
  }
}
