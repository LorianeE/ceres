import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import User from "../../models/User";

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
}
