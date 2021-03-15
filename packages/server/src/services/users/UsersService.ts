import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {Forbidden, NotFound} from "@tsed/exceptions";
import {User} from "../../models/User";
import {Store} from "../../models/Store";

@Service()
export class UsersService {
  @Inject(User)
  private user: MongooseModel<User>;
  @Inject(Store)
  private store: MongooseModel<Store>;

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

  async addStore(userId: string, store: Store): Promise<void> {
    const user = await this.user.findById(userId).exec();
    if (user) {
      // Check if user already have a store
      if (user.store) {
        throw new Forbidden("User already have a store.");
      }
      user.store = store;
      await user.save();
      return;
    }
    throw new NotFound("User not found.");
  }
}
