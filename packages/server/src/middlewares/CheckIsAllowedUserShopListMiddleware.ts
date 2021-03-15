import {Middleware, Req, PathParams} from "@tsed/common";
import {BadRequest, Unauthorized} from "@tsed/exceptions";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
import {User} from "../models/User";
import {UsersService} from "../services/users/UsersService";

@Middleware()
export class CheckIsAllowedUserShopListMiddleware {
  constructor(private usersService: UsersService) {}

  async use(@PathParams("shoppingListId") shoppingListId: string, @Req("user") user: User): Promise<void> {
    if (!ObjectId.isValid(shoppingListId)) {
      throw new BadRequest("Invalid store id");
    }
    const userDB = await this.usersService.findOne({_id: user._id});
    if (userDB && !userDB.shoppingLists.includes(shoppingListId)) {
      throw new Unauthorized("Shopping list id does not match user's shopping lists.");
    }
  }
}
