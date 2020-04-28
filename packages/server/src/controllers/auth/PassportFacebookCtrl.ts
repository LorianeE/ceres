import {Controller, Get, Redirect, Req} from "@tsed/common";
import {Authenticate} from "@tsed/passport";
import User from "../../models/User";

const redirectUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:3000/";

@Controller("/")
export class PassportFacebookCtrl {
  @Get("/auth/facebook")
  @Authenticate("facebook", { scope: "email", failureRedirect: redirectUrl})
  @Redirect(redirectUrl)
  authenticate(@Req("user") user: User) {
    // Facade
    return user;
  }

  @Get("/auth/facebook/callback")
  @Authenticate("facebook", { failureRedirect: redirectUrl })
  @Redirect(redirectUrl)
  callback(@Req("user") user: User) {
    // Facade
    return user;
  }
}
