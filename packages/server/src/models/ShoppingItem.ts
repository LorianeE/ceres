import {Minimum, Required} from "@tsed/common";
import {Ref} from "@tsed/mongoose";
import Product from "./Product";

export class ShoppingItem {
  @Required()
  @Ref(Product)
  product: Ref<Product>;

  @Required()
  @Minimum(1)
  quantity: number;
}
