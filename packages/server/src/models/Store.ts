import {Model, ObjectID} from "@tsed/mongoose";
import {CollectionOf, Required} from "@tsed/schema";
import {StoreItem} from "./StoreItem";

@Model()
export class Store {
  @ObjectID("id")
  _id: string;

  @Required()
  @CollectionOf(StoreItem)
  items: StoreItem[];
}
