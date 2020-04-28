import {Default, Enum, Required} from "@tsed/common";
import {Model, ObjectID, Unique} from "@tsed/mongoose";
import {ShelfTypes} from "./ShelfTypes";

@Model()
export default class Product {

  @ObjectID("id")
  _id: string;

  @Required()
  @Unique()
  productId: string;

  @Required()
  label: string;

  @Required()
  @Enum(ShelfTypes)
  shelf: ShelfTypes;

  @Default(0)
  minimumQuantity: number = 0;
}
