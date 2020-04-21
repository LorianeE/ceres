import {Minimum, Required} from "@tsed/common";
import Product from "./Product";

export class ShoppingItem {
  @Required()
  product: Product;

  @Required()
  @Minimum(1)
  quantity: number;
}
