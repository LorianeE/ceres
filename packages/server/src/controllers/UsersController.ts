import {BodyParams, Controller, Get, PathParams, Post} from "@tsed/common";
import {UserProductsController} from "./UserProductsController";
import {Returns, Summary} from "@tsed/schema";
import {Store} from "../models/Store";
import {StoreService} from "../services/StoreService";
import {UsersService} from "../services/users/UsersService";
import {ShoppingList} from "../models/ShoppingList";
import {ShoppingListService} from "../services/ShoppingListService";
import {Recipe} from "../models/Recipe";
import {RecipeService} from "../services/RecipeService";

@Controller({
  path: "/users",
  children: [UserProductsController]
})
export class UsersController {
  constructor(
    private storeService: StoreService,
    private shoppingListService: ShoppingListService,
    private recipeService: RecipeService,
    private usersService: UsersService
  ) {}

  @Post("/:userId/shopping-list")
  @Summary("Post a new shopping list for given user")
  @Returns(201, ShoppingList)
  async addShoppingList(@BodyParams(ShoppingList) shoppingList: ShoppingList, @PathParams("userId") userId: string): Promise<ShoppingList> {
    const createdShoppingList = await this.shoppingListService.save(shoppingList);
    await this.usersService.addShoppingList(userId, createdShoppingList._id);

    return createdShoppingList;
  }

  @Post("/:userId/store")
  @Summary("Add a new store for a user")
  @Returns(201, Store)
  async addStore(@PathParams("userId") userId: string, @BodyParams(Store) store: Store): Promise<Store> {
    const createdStore = await this.storeService.save(store);
    await this.usersService.addStore(userId, createdStore);

    return createdStore;
  }

  @Post("/:userId/recipes")
  @Summary("Add a new recipe for a user")
  @Returns(201, Recipe)
  async addRecipe(@PathParams("userId") userId: string, @BodyParams(Recipe) recipe: Recipe): Promise<Recipe> {
    return this.recipeService.addUserToRecipe(userId, recipe);
  }

  @Get("/:userId/recipes")
  @Summary("Get all recipes for a user")
  @(Returns(200, Array).Of(Recipe))
  async getUserRecipes(@PathParams("userId") userId: string): Promise<Recipe[]> {
    return this.recipeService.getUserRecipes(userId);
  }
}
