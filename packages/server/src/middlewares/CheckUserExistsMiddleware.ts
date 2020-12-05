import {Middleware, PathParams} from "@tsed/common";
import {UsersService} from "../services/users/UsersService";
import {NotFound} from "@tsed/exceptions";

@Middleware()
export class CheckUserExistsMiddleware {
  constructor(private usersService: UsersService) {}

  async use(@PathParams("userId") userId: string): Promise<void> {
    const userDB = await this.usersService.findOne({_id: userId});
    if (!userDB) {
      throw new NotFound("User does not exist");
    }
  }
}
