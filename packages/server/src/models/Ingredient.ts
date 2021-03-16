import {Groups, Required} from "@tsed/schema";
import {Model, ObjectID, Ref} from "@tsed/mongoose";
import {Product} from "./Product";

@Model()
export class Ingredient {
  @ObjectID("id")
  @Groups("!creation")
  _id: string;

  @Required()
  @Ref(() => Product)
  product: Ref<Product>;

  @Required()
  quantity: number;
}
