import {Default, Property, Required} from "@tsed/schema";
import {Model, Unique, Ref, ObjectID} from "@tsed/mongoose";
import {UserInfo} from "@tsed/passport";
import {ShoppingList} from "./ShoppingList";

@Model()
export class User extends UserInfo {
  @Property()
  @ObjectID("id")
  _id: string;

  @Unique()
  facebookId: string;

  @Required()
  firstName: string;

  @Required()
  lastName: string;

  @Property()
  email: string;

  @Default([])
  @Ref("ShoppingList")
  shoppingLists: Ref<ShoppingList>[] = [];
}
