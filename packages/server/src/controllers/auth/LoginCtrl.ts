import {Controller, Get, Req, Status} from "@tsed/common";

@Controller("/")
export class LoginCtrl {
  @Get("/auth/login/success")
  @Status(200)
  getAuthenticatedUser(@Req() req: Req) {
    if (req.isAuthenticated()) {
      return req.user;
    }

    return null;
  }

  @Get("/auth/logout")
  @Status(204)
  logout(@Req() req: Req) {
    req.logout();
  }
}
