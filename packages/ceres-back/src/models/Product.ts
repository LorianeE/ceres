import {Default, Enum, Required} from "@tsed/common";
import {Model, Unique} from "@tsed/mongoose";
import {ShelfTypes} from "./ShelfTypes";

@Model()
export class Product {
  @Required()
  @Unique()
  id: string;

  @Required()
  label: string;

  @Required()
  @Enum(ShelfTypes)
  shelf: ShelfTypes;

  @Default(0)
  minimumQuantity: number = 0;
}
