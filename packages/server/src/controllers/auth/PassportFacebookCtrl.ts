import {Controller, Get, Redirect, Req} from "@tsed/common";
import {Authenticate} from "@tsed/passport";
import User from "../../models/User";

const redirectUrl = process.env.NODE_ENV === "production" ? "/shoppinglist" : "http://localhost:3000/shoppinglist";

@Controller("/")
export class PassportFacebookCtrl {
  @Get("/auth/facebook")
  @Authenticate("facebook")
  @Redirect(redirectUrl)
  authenticate(@Req("user") user: User) {
    // Facade
    return user;
  }

  @Get("/auth/facebook/callback")
  @Authenticate("facebook") // A cause de ça, ça renvoie une 401 au navigateur si on a une erreur lors du login
  @Redirect(redirectUrl)
  callback(@Req("user") user: User) {
    // Facade
    return user;
  }
}
