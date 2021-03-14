import {Minimum, Property, Required} from "@tsed/schema";
import {Ref} from "@tsed/mongoose";
import {Product} from "./Product";

export class PostShoppingItem {
  @Required()
  @Ref(() => Product)
  product: Ref<Product>;

  @Required()
  @Minimum(1)
  quantity: number;

  @Property()
  comment: string;
}
