import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import User from "../../models/User";
import {NotFound} from "ts-httpexceptions";

@Service()
export class UsersService {
  @Inject(User)
  private user: MongooseModel<User>;

  /**
   * Find a specific user.
   * @returns {null|User}
   */
  async findOne(params: object): Promise<User | null> {
    return this.user.findOne(params);
  }

  async create(user: User): Promise<User> {
    const model = new this.user(user);

    return model.save();
  }

  async addShoppingList(user: User, shoppingListId: string) {
    const dbUser = await this.user.findById(user._id);
    if (dbUser) {
      dbUser.shoppingLists.push(shoppingListId);
      await dbUser.save();

      return dbUser;
    }
    throw new NotFound("User not found.");
  }
}
