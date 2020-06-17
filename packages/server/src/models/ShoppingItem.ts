import {Minimum, Property, Required} from "@tsed/common";
import {ObjectID, Ref} from "@tsed/mongoose";
import {Product} from "./Product";

export class ShoppingItem {
  @ObjectID("id")
  _id: string;

  @Required()
  @Ref(Product)
  product: Ref<Product>;

  @Required()
  @Minimum(1)
  quantity: number;

  @Property()
  comment: string;
}
