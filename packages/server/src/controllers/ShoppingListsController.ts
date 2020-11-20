import {$log, BodyParams, Context, Controller, Get, PathParams, Post, Put, Req, UseBefore} from "@tsed/common";
import {Returns, Summary} from "@tsed/schema";
import {BadRequest, NotFound} from "@tsed/exceptions";
import {ShoppingList} from "../models/ShoppingList";
import {ShoppingListService} from "../services/ShoppingListService";
import {Authenticate} from "@tsed/passport";
import User from "../models/User";
import {UsersService} from "../services/users/UsersService";
import {CheckShoppingListIdMiddleware} from "../middlewares/CheckShoppingListIdMiddleware";

@Controller("/shopping-lists")
export class ShoppingListsController {
  constructor(private shoppingListService: ShoppingListService, private usersService: UsersService) {}

  @Get("/:shoppingListId")
  @Summary("Get a specific shopping list")
  @Authenticate("facebook")
  @UseBefore(CheckShoppingListIdMiddleware)
  @Returns(200, ShoppingList)
  async get(@Context() context: Context, @PathParams("shoppingListId") shoppingListId: string): Promise<ShoppingList> {
    const shoppingList = await this.shoppingListService.find(shoppingListId);
    if (!shoppingList) {
      throw new NotFound("Could not find shopping list");
    }

    return shoppingList;
  }

  @Post("/")
  @Summary("Post a new shopping list for current user")
  @Authenticate("facebook")
  @Returns(201, ShoppingList)
  async create(@BodyParams(ShoppingList) shoppingList: ShoppingList, @Req("user") user: User): Promise<ShoppingList> {
    try {
      const createdShoppingList = await this.shoppingListService.save(shoppingList);
      await this.usersService.addShoppingList(user, createdShoppingList._id);

      return createdShoppingList;
    } catch (e) {
      $log.error(e);
      throw e;
    }
  }

  @Put("/:shoppingListId")
  @Summary("Update a specific shopping list")
  @Authenticate("facebook")
  @UseBefore(CheckShoppingListIdMiddleware)
  @Returns(200, ShoppingList)
  async update(
    @PathParams("shoppingListId") shoppingListId: string,
    @BodyParams(ShoppingList) shoppingList: ShoppingList
  ): Promise<ShoppingList> {
    if (shoppingList._id !== shoppingListId) {
      throw new BadRequest("Shopping list id does not match param id");
    }
    try {
      return this.shoppingListService.save(shoppingList);
    } catch (e) {
      $log.error(e);
      throw e;
    }
  }
}
