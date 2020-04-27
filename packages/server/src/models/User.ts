import {Default, Property, Required} from "@tsed/common";
import {Model, Unique, Ref} from "@tsed/mongoose";
import {UserInfo} from "@tsed/passport";
import {ShoppingList} from "./ShoppingList";

@Model()
export default class User extends UserInfo {

  @Property()
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
  @Ref(ShoppingList)
  shoppingLists: Ref<ShoppingList>[] = [];
}
