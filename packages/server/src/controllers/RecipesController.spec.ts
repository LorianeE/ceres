import {PlatformTest} from "@tsed/common";
import {RecipesController} from "./RecipesController";
import {RecipeService} from "../services/RecipeService";
import {NotFound} from "@tsed/exceptions";
import {User} from "../models/User";
import {Recipe} from "../models/Recipe";

describe("RecipesController", () => {
  describe("getRecipe()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    it("should return a result from recipeService", async () => {
      // GIVEN
      const recipeService = {
        find: jest.fn().mockResolvedValue({id: "1", items: []})
      };

      const recipesCtrl = await PlatformTest.invoke(RecipesController, [
        {
          token: RecipeService,
          use: recipeService
        }
      ]);

      // WHEN
      const result = await recipesCtrl.getRecipe("storeId");

      // THEN
      expect(result).toEqual({id: "1", items: []});
      expect(recipeService.find).toHaveBeenCalledTimes(1);
      expect(recipeService.find).toHaveBeenCalledWith("storeId");
    });
    it("should throw notfound if recipe not found", async () => {
      // GIVEN
      const recipeService = {
        find: jest.fn().mockResolvedValue(null)
      };

      const recipesCtrl = await PlatformTest.invoke(RecipesController, [
        {
          token: RecipeService,
          use: recipeService
        }
      ]);

      // WHEN
      let actualError;
      try {
        await recipesCtrl.getRecipe("storeId");
      } catch (err) {
        actualError = err;
      }

      // THEN
      expect(actualError).toBeInstanceOf(NotFound);
    });
  });
  describe("updateRecipe()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    describe("with an authorized user", () => {
      const user = new User();
      user._id = "userId";
      it("should return a result from recipeService if ok", async () => {
        // GIVEN
        const recipe = new Recipe();

        const recipeService = {
          updateRecipe: jest.fn().mockResolvedValue(recipe)
        };

        const recipesCtrl = await PlatformTest.invoke(RecipesController, [
          {
            token: RecipeService,
            use: recipeService
          }
        ]);

        // WHEN
        const result = await recipesCtrl.updateRecipe(recipe, user._id.toString());

        // THEN
        expect(recipeService.updateRecipe).toHaveBeenCalledTimes(1);
        expect(recipeService.updateRecipe).toHaveBeenCalledWith(recipe, user._id);
        expect(result).toEqual(recipe);
      });
      it("should throw error if recipeService throws error", async () => {
        // GIVEN
        const recipe = new Recipe();

        const recipeService = {
          updateRecipe: jest.fn().mockRejectedValue(new Error("An error occured"))
        };

        const recipesCtrl = await PlatformTest.invoke(RecipesController, [
          {
            token: RecipeService,
            use: recipeService
          }
        ]);

        // WHEN
        let actualError;
        try {
          await recipesCtrl.updateRecipe(recipe, user._id.toString());
        } catch (e) {
          actualError = e;
        }

        // THEN
        expect(recipeService.updateRecipe).toHaveBeenCalledTimes(1);
        expect(actualError).toBeInstanceOf(Error);
      });
    });
  });
  describe("deleteRecipe()", () => {
    beforeEach(() => PlatformTest.create());
    afterEach(() => PlatformTest.reset());
    const user = new User();
    user._id = "userId";
    it("should call removeRecipeFromUser method from recipeService", async () => {
      // GIVEN
      const recipe = new Recipe();
      recipe._id = "recipeId";

      const recipeService = {
        removeRecipeFromUser: jest.fn()
      };

      const recipesCtrl = await PlatformTest.invoke(RecipesController, [
        {
          token: RecipeService,
          use: recipeService
        }
      ]);

      // WHEN
      await recipesCtrl.deleteRecipe(recipe._id, user._id);

      // THEN
      expect(recipeService.removeRecipeFromUser).toHaveBeenCalledTimes(1);
      expect(recipeService.removeRecipeFromUser).toHaveBeenCalledWith("recipeId", "userId");
    });
  });
});
