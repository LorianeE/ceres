import {Middleware, Req, PathParams} from "@tsed/common";
import {BadRequest, Unauthorized} from "@tsed/exceptions";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
import {User} from "../models/User";
import {UsersService} from "../services/users/UsersService";

@Middleware()
export class CheckIsAllowedUserStoreMiddleware {
  constructor(private usersService: UsersService) {}

  async use(@PathParams("storeId") storeId: string, @Req("user") user: User): Promise<void> {
    const userDB = await this.usersService.findOne({_id: user._id});
    if (!ObjectId.isValid(storeId)) {
      throw new BadRequest("Invalid store id");
    }
    if (userDB && userDB.store && userDB.store.toString() !== storeId) {
      throw new Unauthorized("Store id does not match user's store.");
    }
  }
}
