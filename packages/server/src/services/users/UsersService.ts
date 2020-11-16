import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {NotFound} from "@tsed/exceptions";
import User from "../../models/User";

@Service()
export class UsersService {
  @Inject(User)
  private user: MongooseModel<User>;

  /**
   * Find a specific user.
   * @returns {null|User}
   */
  async findOne(params: Record<string, unknown>): Promise<User | null> {
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
