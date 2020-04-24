import {Inject, Req} from "@tsed/common";
import {Args, OnVerify, Protocol, UserInfo} from "@tsed/passport";
import {Strategy, StrategyOption} from "passport-facebook";
import {UsersService} from "../services/users/UsersService";
import User from "../models/User";

@Protocol<StrategyOption>({
  name: "facebook",
  useStrategy: Strategy,
  settings: {
    clientID: process.env.FACEBOOK_APP_ID || "FACEBOOK_APP_ID",
    clientSecret: process.env.FACEBOOK_APP_SECRET || "FACEBOOK_APP_SECRET",
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || "http://localhost:8083/rest/auth/facebook/callback",
    profileFields: ["id", "name", "email"]
  }
})
export class FacebookProtocol implements OnVerify {
  @Inject()
  private usersService: UsersService;

  async $onVerify(@Req() req: Req, @Args() [accessToken, refreshToken, profile]: any) {
    profile.refreshToken = refreshToken;

    let user = await this.usersService.findOne({facebookId: profile.id});

    if (!user) {
      const userToCreate = new User();
      userToCreate.facebookId = profile.id;
      userToCreate.firstName = profile._json.first_name;
      userToCreate.lastName = profile._json.last_name;
      userToCreate.email = profile._json.emails ? profile._json.emails[0] : "";

      user = await this.usersService.create(userToCreate);
    }

    return user;
  }
}
