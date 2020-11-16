import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {NotFound} from "@tsed/exceptions";
import {User} from "../../models/User";

@Service()
export class UsersService {
  @Inject(User)
  private user: MongooseModel<User>;

  /**
   * Find a specific user.
   * @returns {null|User}
   */
  async findOne(params: Record<string, unknown>): Promise<User | null> {
    return this.user.findOne(params).exec();
  }

  async create(user: User): Promise<User> {
    const model = new this.user(user);

    return model.save();
  }

  async addShoppingList(userId: string, shoppingListId: string): Promise<void> {
    const user = await this.user.findById(userId).exec();
    if (user) {
      user.shoppingLists.push(shoppingListId);
      await user.save();
      return;
    }
    throw new NotFound("User not found.");
  }
}
