import {Middleware, Req, PathParams} from "@tsed/common";
import {User} from "../models/User";
import {UsersService} from "../services/users/UsersService";
import {Unauthorized} from "@tsed/exceptions";

@Middleware()
export class CheckIsAllowedUserMiddleware {
  constructor(private usersService: UsersService) {}

  async use(@PathParams("shoppingListId") shoppingListId: string, @Req("user") user: User): Promise<void> {
    const userDB = await this.usersService.findOne({_id: user._id});
    if (userDB && !userDB.shoppingLists.includes(shoppingListId)) {
      throw new Unauthorized("Shopping list id does not match user's shopping lists.");
    }
  }
}
