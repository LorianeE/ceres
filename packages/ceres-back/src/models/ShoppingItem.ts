import {
  Minimum,
  Required
} from "@tsed/common";
import {Product} from "./Product";

export class ShoppingItem {
  _id: string;

  @Required()
  product: Product;

  @Required()
  @Minimum(1)
  quantity: Number;

  constructor(product: Product, quantity: number) {
    this.product = product;
    this.quantity = quantity;
  }
}
