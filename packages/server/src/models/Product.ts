import {Default, Enum, Groups, Required} from "@tsed/schema";
import {Model, ObjectID, Ref} from "@tsed/mongoose";
import {ShelfTypes} from "./ShelfTypes";
import {User} from "./User";

@Model()
export class Product {
  @ObjectID("id")
  @Groups("!creation")
  _id: string;

  @Required()
  label: string;

  @Required()
  @Enum(ShelfTypes)
  shelf: ShelfTypes;

  @Default(0)
  minimumQuantity: number = 0;

  @Ref("User")
  users: Ref<User>[] = [];
}
