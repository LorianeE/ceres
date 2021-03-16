import {PlatformContext, PlatformTest} from "@tsed/common";
import SuperTest from "supertest";
import {Server} from "../../../src/Server";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {PassportMiddleware} from "@tsed/passport";
import {UsersService} from "../../../src/services/users/UsersService";
import {User} from "../../../src/models/User";
import {RecipeService} from "../../../src/services/RecipeService";
import {Recipe} from "../../../src/models/Recipe";

describe("Recipes", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let recipe: Recipe;
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

        // Create new recipe and put it in DB
        const rcp = new Recipe();
        rcp.title = "Apple pie";
        rcp.nbGuests = 6;
        recipe = await recipeService.save(rcp);

        jest.spyOn(passportMiddleware, "use").mockImplementation(async (ctx: PlatformContext) => {
          ctx.getRequest().user = dbUser;
        });
      }
    )
  );
  afterEach(TestMongooseContext.reset);

  describe("Complete sequence to manage a recipe which already exists for a user", () => {
    it("should manipulate user's recipe", async () => {
      // FIRST GET THE USER RECIPES: EMPTY ARRAY
      const responseGetEmpty = await request.get(`/rest/users/${dbUser._id.toString()}/recipes`).expect(200);
      expect(responseGetEmpty.body).toEqual([]);

      // THEN ADD A NEW RECIPE BASED ON ONE ALREADY EXISTING
      const apiRecipe = {
        id: recipe._id.toString(),
        title: "Apple pie",
        nbGuests: 6,
        ingredients: []
      };
      const responsePost = await request.post(`/rest/users/${dbUser._id.toString()}/recipes`).send(apiRecipe).expect(201);
      expect(responsePost.body.id).toEqual(recipe._id.toString());
      expect(responsePost.body.users[0]).toEqual(dbUser._id.toString());

      // THEN GET USER RECIPES LIST, NOT EMPTY
      const responseGetFull = await request.get(`/rest/users/${dbUser._id.toString()}/recipes`).expect(200);
      expect(responseGetFull.body).toEqual([
        {
          ...apiRecipe,
          users: [dbUser._id.toString()]
        }
      ]);

      // THEN UPDATE IT (WITHOUT USERIDS BUT IT DOES NOT MATTER)
      const updatedApiRecipe = {
        id: recipe._id.toString(),
        title: "Pear Pie",
        nbGuests: 6,
        ingredients: []
      };
      const responsePut = await request.put(`/rest/recipes/${recipe._id.toString()}`).send(updatedApiRecipe).expect(200);
      console.log(responsePut.body);
      expect(responsePut.body.id).toEqual(recipe._id.toString());
      expect(responsePut.body.title).toEqual("Pear Pie");
      expect(responsePut.body.nbGuests).toEqual(6);
      expect(responsePut.body.users[0]).toEqual(dbUser._id.toString());

      // THEN DELETE IT
      await request.delete(`/rest/recipes/${recipe._id.toString()}`).expect(204);
      // THEN CHECK USER LIST, IT MUST BE DELETED
      const responseGetAfterDelete = await request.get(`/rest/users/${dbUser._id.toString()}/recipes`).expect(200);
      expect(responseGetAfterDelete.body).toEqual([]);
    });
  });
  describe("Sequence to manage a recipe which NOT already exists for a user", () => {
    it("should manipulate user's recipe", async () => {
      // FIRST GET THE USER PRODUCTS: EMPTY ARRAY
      const responseGetEmpty = await request.get(`/rest/users/${dbUser._id.toString()}/recipes`).expect(200);
      expect(responseGetEmpty.body).toEqual([]);

      // THEN ADD A NEW RECIPE
      const newRecipe = {
        title: "Lasagna",
        nbGuests: 3,
        ingredients: []
      };
      const {body: addedRecipe} = await request.post(`/rest/users/${dbUser._id.toString()}/recipes`).send(newRecipe).expect(201);
      expect(addedRecipe.title).toEqual("Lasagna");
      expect(addedRecipe.nbGuests).toEqual(3);
      expect(addedRecipe.users[0]).toEqual(dbUser._id.toString());

      // THEN GET USER RECIPES LIST, NOT EMPTY
      const responseGetFull = await request.get(`/rest/users/${dbUser._id.toString()}/recipes`).expect(200);
      expect(responseGetFull.body[0].id).toEqual(addedRecipe.id);
      expect(responseGetFull.body[0].users).toEqual([dbUser._id.toString()]);

      // THEN DELETE IT
      await request.delete(`/rest/recipes/${addedRecipe.id}`).expect(204);
      // THEN CHECK USER LIST, IT MUST BE DELETED
      const responseGetAfterDelete = await request.get(`/rest/users/${dbUser._id.toString()}/recipes`).expect(200);
      expect(responseGetAfterDelete.body).toEqual([]);
    });
  });
});
