import {Property, Required} from "@tsed/schema";
import {Model, ObjectID, Ref} from "@tsed/mongoose";
import {Product} from "./Product";

@Model()
export class ShoppingItem {
  @ObjectID("id")
  _id: string;

  @Required()
  @Ref(Product)
  product: Ref<Product>;

  @Required()
  quantity: number;

  @Property()
  comment: string;
}
