import {Model, ObjectID, Ref} from "@tsed/mongoose";
import {CollectionOf, Default, Required} from "@tsed/schema";
import {StoreItem} from "./StoreItem";
import {User} from "./User";

@Model()
export class Store {
  @ObjectID("id")
  _id: string;

  @Required()
  @CollectionOf(StoreItem)
  items: StoreItem[];

  @Default([])
  @Ref("User")
  users: Ref<User>[] = [];
}
