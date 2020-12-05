import {Controller, Get, Inject, Req} from "@tsed/common";
import {Status} from "@tsed/schema";
import {UsersService} from "../../services/users/UsersService";
import {User} from "../../models/User";
import {Unauthorized} from "@tsed/exceptions";

@Controller("/")
export class LoginCtrl {
  @Inject()
  private usersService: UsersService;

  @Get("/auth/userinfo")
  @Status(200)
  getAuthenticatedUser(@Req() req: Req, @Req("user") user: User): Promise<User | null> {
    if (req.isAuthenticated()) {
      return this.usersService.findOne({_id: user._id});
    }
    throw new Unauthorized("Not allowed.");
  }

  @Get("/auth/logout")
  @Status(204)
  logout(@Req() req: Req): void {
    req.logout();
  }
}
