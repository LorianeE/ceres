import {PropertyType, Required} from "@tsed/common";
import {Model, ObjectID, Unique} from "@tsed/mongoose";
import {ShoppingList} from "./ShoppingList";
import {UserInfo} from "@tsed/passport";

@Model()
export default class User extends UserInfo {

  @ObjectID("id")
  _id: string;

  @Unique()
  facebookId: string;

  @Required()
  firstName: string;

  @Required()
  lastName: string;

  @Unique()
  email: string;

  @PropertyType(ShoppingList)
  shoppingLists: ShoppingList[];
}
