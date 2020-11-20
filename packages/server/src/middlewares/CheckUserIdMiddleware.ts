import {Middleware, PathParams, Req} from "@tsed/common";
import User from "../models/User";
import {Unauthorized} from "@tsed/exceptions";

@Middleware()
export class CheckUserIdMiddleware {
  use(@PathParams("userId") userId: string, @Req("user") user: User): void {
    if (user._id !== userId) {
      throw new Unauthorized("User id does not match with authorized user.");
    }
  }
}
