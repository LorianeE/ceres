import {BodyParams, Context, Controller, Get, PathParams, Post, Put, UseBefore, UseBeforeEach} from "@tsed/common";
import {ShoppingListService} from "../services/ShoppingListService";
import {Returns, Summary} from "@tsed/schema";
import {Authenticate} from "@tsed/passport";
import {CheckIsAllowedUserMiddleware} from "../middlewares/CheckIsAllowedUserMiddleware";
import {ShoppingList} from "../models/ShoppingList";
import {NotFound} from "@tsed/exceptions";
import {CheckShoppingListIdMiddleware} from "../middlewares/CheckShoppingListIdMiddleware";
import {UsersService} from "../services/users/UsersService";
import {CheckUserIdMiddleware} from "../middlewares/CheckUserIdMiddleware";

@Controller("/:userId/shopping-lists")
@Authenticate("facebook")
@UseBeforeEach(CheckUserIdMiddleware)
export class ShoppingListsController {
  constructor(private shoppingListService: ShoppingListService, private usersService: UsersService) {}

  @Get("/:shoppingListId")
  @Summary("Get shopping list from a user")
  @UseBefore(CheckIsAllowedUserMiddleware)
  @Returns(200, ShoppingList)
  async get(@Context() context: Context, @PathParams("shoppingListId") shoppingListId: string): Promise<ShoppingList> {
    const shoppingList = await this.shoppingListService.find(shoppingListId);
    if (!shoppingList) {
      throw new NotFound("Could not find shopping list");
    }

    return shoppingList;
  }

  @Post("/")
  @Summary("Post a new shopping list for given user")
  @Returns(201, ShoppingList)
  async create(@BodyParams(ShoppingList) shoppingList: ShoppingList, @PathParams("userId") userId: string): Promise<ShoppingList> {
    const createdShoppingList = await this.shoppingListService.save(shoppingList);
    await this.usersService.addShoppingList(userId, createdShoppingList._id);

    return createdShoppingList;
  }

  @Put("/:shoppingListId")
  @Summary("Update shopping list from a user")
  @UseBefore(CheckIsAllowedUserMiddleware)
  @UseBefore(CheckShoppingListIdMiddleware)
  @Returns(200, ShoppingList)
  async update(
    @PathParams("shoppingListId") shoppingListId: string,
    @BodyParams(ShoppingList) shoppingList: ShoppingList
  ): Promise<ShoppingList> {
    return this.shoppingListService.save(shoppingList);
  }
}
