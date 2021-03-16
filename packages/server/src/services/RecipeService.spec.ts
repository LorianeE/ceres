import {Recipe} from "../models/Recipe";
import {RecipeService} from "./RecipeService";
import {PlatformTest} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";

describe("RecipeService", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("find()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());

    it("should return a specific recipe", async () => {
      // GIVEN
      const recipe = {
        findById: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({id: "1234"})
        })
      };

      const recipeService = await PlatformTest.invoke(RecipeService, [
        {
          token: Recipe,
          use: recipe
        }
      ]);

      // WHEN
      const result = await recipeService.find("1234");

      // THEN
      expect(result).toEqual({id: "1234"});
      expect(recipe.findById).toHaveBeenCalled();

      expect(recipeService).toBeInstanceOf(RecipeService);
    });
  });

  describe("getUserRecipes()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    it("should return all recipes from db for a user", async () => {
      // GIVEN
      const recipes = {
        find: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([{_id: "recipeId", users: ["userId"]}])
        })
      };
      const recipeService = await PlatformTest.invoke(RecipeService, [
        {
          token: Recipe,
          use: recipes
        }
      ]);

      // WHEN
      const result = await recipeService.getUserRecipes("userId");

      // THEN
      expect(result).toEqual([{_id: "recipeId", users: ["userId"]}]);
      expect(recipes.find).toHaveBeenCalledWith({users: "userId"});
      expect(recipeService).toBeInstanceOf(RecipeService);
    });
  });

  describe("save()", () => {
    async function getRecipeService(locals: any[]) {
      const prototype = {};
      const recipeModel = jest.fn().mockImplementation(() => {
        return prototype;
      });
      // @ts-ignore
      recipeModel.findOneAndUpdate = jest.fn().mockReturnValue({exec: () => jest.fn()});
      locals.push({
        token: Recipe,
        use: recipeModel
      });

      return {
        recipeService: (await PlatformTest.invoke(RecipeService, locals)) as RecipeService,
        recipeModel,
        prototype
      };
    }
    it("should save recipe without _id", async () => {
      // GIVEN
      const recipe = new Recipe();
      recipe.title = "New recipe";

      const {recipeService, recipeModel} = await getRecipeService([]);

      // WHEN
      await recipeService.save(recipe);

      // THEN
      // @ts-ignore
      expect(recipeModel.findOneAndUpdate).toHaveBeenCalledWith(expect.anything(), recipe, {upsert: true, new: true});
    });
  });

  describe("updateRecipe()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    it("should update recipe", async () => {
      // GIVEN
      const recipe = new Recipe();
      recipe._id = "recipeId";
      recipe.title = "New Recipe";
      recipe.nbGuests = 6;

      const recipes = {
        findOneAndUpdate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({_id: "recipeId", title: "New Recipe"})
        })
      };
      const recipeService = await PlatformTest.invoke(RecipeService, [
        {
          token: Recipe,
          use: recipes
        }
      ]);

      // WHEN
      const result = await recipeService.updateRecipe(recipe, "userId");

      // THEN
      expect(recipes.findOneAndUpdate).toHaveBeenCalledWith(
        {
          $and: [
            {
              _id: recipe._id
            },
            {
              users: "userId"
            }
          ]
        },
        {
          $set: {
            title: recipe.title,
            url: undefined,
            nbGuests: recipe.nbGuests,
            ingredients: []
          }
        },
        {new: true}
      );
      expect(result).toEqual({_id: "recipeId", title: "New Recipe"});
      expect(recipeService).toBeInstanceOf(RecipeService);
    });
    it("should throw notfound if findOneAndUpdate responds undefined", async () => {
      // GIVEN
      const recipe = new Recipe();
      recipe._id = "recipeId";
      recipe.title = "New Recipe";
      recipe.nbGuests = 6;

      const recipes = {
        findOneAndUpdate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(undefined)
        })
      };
      const recipeService = await PlatformTest.invoke(RecipeService, [
        {
          token: Recipe,
          use: recipes
        }
      ]);

      // WHEN
      let actualError;
      try {
        await recipeService.updateRecipe(recipe, "userId");
      } catch (err) {
        actualError = err;
      }

      // THEN
      expect(recipes.findOneAndUpdate).toHaveBeenCalledWith(
        {
          $and: [
            {
              _id: "recipeId"
            },
            {
              users: "userId"
            }
          ]
        },
        {
          $set: {
            title: recipe.title,
            url: recipe.url,
            nbGuests: recipe.nbGuests,
            ingredients: recipe.ingredients
          }
        },
        {new: true}
      );
      expect(actualError).toBeInstanceOf(NotFound);
      expect(recipeService).toBeInstanceOf(RecipeService);
    });
  });

  describe("removeRecipeFromUser()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    it("should remove userid from recipe's user ids", async () => {
      // GIVEN
      const save = jest.fn().mockResolvedValue([{_id: "recipeId", users: ["userId2"]}]);
      const recipes = {
        findOne: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({_id: "recipeId", users: ["userId", "userId2"], save})
        })
      };
      const recipeService = await PlatformTest.invoke(RecipeService, [
        {
          token: Recipe,
          use: recipes
        }
      ]);

      // WHEN
      await recipeService.removeRecipeFromUser("recipeId", "userId");

      // THEN
      expect(recipeService).toBeInstanceOf(RecipeService);
      expect(recipes.findOne).toHaveBeenCalledWith({
        $and: [
          {
            _id: "recipeId"
          },
          {
            users: "userId"
          }
        ]
      });
      expect(save).toHaveBeenCalledTimes(1);
    });
    it("should remove recipe if user ids list is empty after", async () => {
      // GIVEN
      const save = jest.fn().mockResolvedValue([{_id: "recipeId", users: ["userId2"]}]);
      const recipes = {
        findOne: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue({_id: "recipeId", users: ["userId"], save})
        }),
        deleteOne: jest.fn().mockReturnValue({
          exec: jest.fn()
        })
      };
      const recipeService = await PlatformTest.invoke(RecipeService, [
        {
          token: Recipe,
          use: recipes
        }
      ]);

      // WHEN
      await recipeService.removeRecipeFromUser("recipeId", "userId");

      // THEN
      expect(recipeService).toBeInstanceOf(RecipeService);
      expect(recipes.findOne).toHaveBeenCalledWith({
        $and: [
          {
            _id: "recipeId"
          },
          {
            users: "userId"
          }
        ]
      });
      expect(recipes.deleteOne).toHaveBeenCalledWith({_id: "recipeId"});
    });
    it("should throw notfound if findOne responds undefined", async () => {
      // GIVEN
      const recipes = {
        findOne: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(undefined)
        })
      };
      const recipeService = await PlatformTest.invoke(RecipeService, [
        {
          token: Recipe,
          use: recipes
        }
      ]);

      // WHEN
      let actualError;
      try {
        await recipeService.removeRecipeFromUser("recipeId", "userId");
      } catch (err) {
        actualError = err;
      }

      // THEN
      expect(recipes.findOne).toHaveBeenCalledWith({
        $and: [
          {
            _id: "recipeId"
          },
          {
            users: "userId"
          }
        ]
      });
      expect(actualError).toBeInstanceOf(NotFound);
      expect(recipeService).toBeInstanceOf(RecipeService);
    });
  });
});
