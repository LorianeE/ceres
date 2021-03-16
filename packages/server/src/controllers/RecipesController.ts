import {BodyParams, Controller, Delete, Get, PathParams, Put, Req} from "@tsed/common";
import {Returns, Summary} from "@tsed/schema";
import {Authenticate} from "@tsed/passport";
import {NotFound} from "@tsed/exceptions";
import {Recipe} from "../models/Recipe";
import {RecipeService} from "../services/RecipeService";

@Controller("/recipes")
@Authenticate("facebook")
export class RecipesController {
  constructor(private recipeService: RecipeService) {}

  @Get("/tags")
  @Summary("Get all tags for recipes")
  @(Returns(200, Array).Of(String))
  async getAllTags(): Promise<string[]> {
    return this.recipeService.getAllTags();
  }

  @Get("/:recipeId")
  @Summary("Get a recipe")
  @Returns(200, Recipe)
  async getRecipe(@PathParams("recipeId") recipeId: string): Promise<Recipe> {
    const recipe = await this.recipeService.find(recipeId);
    if (!recipe) {
      throw new NotFound("Recipe not found.");
    }
    return recipe;
  }

  @Put("/:recipeId")
  @Summary("Update a recipe")
  @Returns(200, Recipe)
  async updateRecipe(@BodyParams(Recipe) recipe: Recipe, @Req("user._id") userId: string): Promise<Recipe> {
    return this.recipeService.updateRecipe(recipe, userId.toString());
  }

  @Delete("/:recipeId")
  @Summary("Remove an recipe")
  @Returns(204)
  async deleteRecipe(@PathParams("recipeId") recipeId: string, @Req("user._id") userId: string): Promise<void> {
    return this.recipeService.removeRecipeFromUser(recipeId, userId.toString());
  }
}
