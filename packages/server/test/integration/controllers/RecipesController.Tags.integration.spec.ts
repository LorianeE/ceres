import {PlatformContext, PlatformTest} from "@tsed/common";
import SuperTest from "supertest";
import {Server} from "../../../src/Server";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {PassportMiddleware} from "@tsed/passport";
import {UsersService} from "../../../src/services/users/UsersService";
import {User} from "../../../src/models/User";
import {RecipeService} from "../../../src/services/RecipeService";
import {Recipe} from "../../../src/models/Recipe";

describe("Recipes Tags", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let dbUser: User;

  beforeEach(TestMongooseContext.bootstrap(Server));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });
  beforeEach(
    TestMongooseContext.inject(
      [PassportMiddleware, UsersService, RecipeService],
      async (passportMiddleware: PassportMiddleware, usersService: UsersService, recipeService: RecipeService) => {
        // Create new user and put it in DB
        const user = new User();
        user.lastName = "Doe";
        user.firstName = "John";
        user.facebookId = "facebookId";
        dbUser = await usersService.create(user);

        // Create new recipes and put it in DB
        const rcp = new Recipe();
        rcp.title = "Apple pie";
        rcp.nbGuests = 6;
        rcp.tags = ["dessert"];
        await recipeService.save(rcp);

        const rcp2 = new Recipe();
        rcp2.title = "Blanquette de veau";
        rcp2.nbGuests = 4;
        rcp2.tags = ["plat en sauce", "riz"];
        await recipeService.save(rcp2);

        const rcp3 = new Recipe();
        rcp3.title = "Potimarron au four";
        rcp3.nbGuests = 4;
        rcp3.tags = ["hiver", "healthy", "accompagnement"];
        await recipeService.save(rcp3);

        const rcp4 = new Recipe();
        rcp4.title = "Pâtes sauce tomates cerises";
        rcp4.nbGuests = 3;
        rcp4.tags = ["healthy", "pâtes", "accompagnement"];
        await recipeService.save(rcp4);

        jest.spyOn(passportMiddleware, "use").mockImplementation(async (ctx: PlatformContext) => {
          ctx.getRequest().user = dbUser;
        });
      }
    )
  );
  afterEach(TestMongooseContext.reset);

  describe("Get all tags from all recipes with unique entries", () => {
    it("should manipulate user's recipe", async () => {
      const {body: tags} = await request.get(`/rest/recipes/tags`).expect(200);
      expect(tags).toEqual(["accompagnement", "dessert", "healthy", "hiver", "pâtes", "plat en sauce", "riz"]);
    });
  });
});
