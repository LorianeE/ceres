import {Middleware, PathParams, Req} from "@tsed/common";
import {User} from "../models/User";
import {Unauthorized} from "@tsed/exceptions";

@Middleware()
export class CheckUserIdMiddleware {
  use(@PathParams("userId") userId: string, @Req("user") user: User): void {
    if (!user) {
      throw new Unauthorized("User not logged in.");
    }
    if (user._id.toString() !== userId) {
      throw new Unauthorized("User id does not match with authorized user.");
    }
  }
}
