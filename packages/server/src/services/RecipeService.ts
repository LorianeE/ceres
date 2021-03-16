import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import mongoose from "mongoose";
import {NotFound} from "@tsed/exceptions";
import {Recipe} from "../models/Recipe";

@Service()
export class RecipeService {
  @Inject(Recipe)
  private recipe: MongooseModel<Recipe>;

  async save(recipe: Recipe): Promise<Recipe> {
    if (!recipe._id) {
      // We have to create an _id if it is null so that findOneAndUpdate won't save a store with _id: null.
      // We could use findByIdAndUpdate and not have the problem but it seems to be a typescript issue with it.
      recipe._id = mongoose.Types.ObjectId().toString();
    }
    return this.recipe
      .findOneAndUpdate({_id: recipe._id}, recipe, {
        upsert: true,
        new: true
      })
      .exec();
  }

  async find(recipeId: string): Promise<Recipe | null> {
    return this.recipe.findById(recipeId).exec();
  }

  async getUserRecipes(userId: string): Promise<Recipe[]> {
    return this.recipe.find({users: userId}).exec();
  }

  /**
   * Update recipe.
   * @param recipe
   * @param userId
   */
  async updateRecipe(recipe: Recipe, userId: string): Promise<Recipe> {
    const filter = {
      $and: [
        {
          _id: recipe._id
        },
        {
          users: userId
        }
      ]
    };
    const dbRecipe = await this.recipe
      .findOneAndUpdate(
        filter,
        {
          $set: {
            title: recipe.title,
            url: recipe.url,
            nbGuests: recipe.nbGuests,
            ingredients: recipe.ingredients
          }
        },
        {new: true}
      )
      .exec();
    if (dbRecipe) {
      return dbRecipe;
    }
    throw new NotFound("Could not find given recipe for this user");
  }

  /**
   * Add a recipe to database and attach it to given user. If the recipe already exists, it only attach user to it.
   * @param userId
   * @param recipe
   */
  async addUserToRecipe(userId: string, recipe: Recipe): Promise<Recipe> {
    const recipeDoc = await this.recipe.findById(recipe._id);
    if (recipeDoc) {
      return this.recipe.findOneAndUpdate({_id: recipe._id}, {$push: {users: userId}}, {new: true, upsert: true}).exec();
    } else {
      const newRecipe = new this.recipe(recipe);
      newRecipe.users.push(userId);
      return newRecipe.save();
    }
  }

  /**
   * Remove a recipe from a user's list. If the recipe does not belong to any user after this, it is deleted.
   * @param recipeId
   * @param userId
   */
  async removeRecipeFromUser(recipeId: string, userId: string): Promise<void> {
    const recipe = await this.recipe
      .findOne({
        $and: [
          {
            _id: recipeId
          },
          {
            users: userId
          }
        ]
      })
      .exec();
    if (!recipe) {
      throw new NotFound("Could not find given recipe for this user");
    }
    recipe.users = recipe.users.filter((el) => el.toString() !== userId);
    await recipe.save();
    // If users is empty, it means that the recipe is not associated with any user anymore,
    // so we can remove it.
    if (!recipe.users.length) {
      await this.recipe.deleteOne({_id: recipe._id}).exec();
    }
  }
}
