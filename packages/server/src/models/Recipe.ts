import {CollectionOf, Groups, Required, Uri} from "@tsed/schema";
import {Model, ObjectID, Ref} from "@tsed/mongoose";
import {User} from "./User";
import {Ingredient} from "./Ingredient";

@Model()
export class Recipe {
  @ObjectID("id")
  @Groups("!creation")
  _id: string;

  @Required()
  title: string;

  @Uri()
  url: string;

  @Required()
  nbGuests: number;

  @Required()
  @CollectionOf(Ingredient)
  ingredients: Ingredient[] = [];

  @Ref(() => User)
  users: Ref<User>[] = [];
}
