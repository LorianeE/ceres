import {$log, BodyParams, Context, Controller, Get, PathParams, Post, Put, Req, Status} from "@tsed/common";
import {Returns, Summary} from "@tsed/swagger";
import {BadRequest, NotFound, Unauthorized} from "ts-httpexceptions";
import {ShoppingList} from "../models/ShoppingList";
import {ShoppingListService} from "../services/ShoppingListService";
import {Authenticate} from "@tsed/passport";
import User from "../models/User";
import {UsersService} from "../services/users/UsersService";

// TODO: Make a middleware of it
async function checkIfUserIsAllowed(user: User, shoppingListId: string, usersService: UsersService) {
  const userDB = await usersService.findOne({_id: user._id});
  if (userDB && !userDB.shoppingLists.includes(shoppingListId)) {
    throw new Unauthorized("Shopping list id does not match user's shopping lists.");
  }
}

@Controller("/shopping-lists")
export class ShoppingListsController {
  constructor(private shoppingListService: ShoppingListService, private usersService: UsersService) {
  }

  @Get("/:id")
  @Summary("Get a specific shopping list")
  @Authenticate("facebook")
  @Status(200)
  @Returns(ShoppingList)
  async get(@Context() context: Context, @PathParams("id") id: string, @Req("user") user: User): Promise<ShoppingList> {
    await checkIfUserIsAllowed(user, id, this.usersService);
    const shoppingList = await this.shoppingListService.find(id);
    if (!shoppingList) {
      throw new NotFound("Could not find shopping list");
    }

    return shoppingList;
  }

  @Post("/")
  @Summary("Post a shopping list")
  @Authenticate("facebook")
  @Status(201)
  async create(@BodyParams(ShoppingList) shoppingList: ShoppingList, @Req("user") user: User) {
    try {
      const createdShoppingList = await this.shoppingListService.save(shoppingList);
      await this.usersService.addShoppingList(user, createdShoppingList._id);

      return createdShoppingList;
    } catch (e) {
      $log.error(e);
      throw e;
    }
  }

  @Put("/:id")
  @Summary("Update a specific shopping list")
  @Authenticate("facebook")
  @Status(200)
  async update(@PathParams("id") id: string, @BodyParams(ShoppingList) shoppingList: ShoppingList, @Req("user") user: User) {
    if (shoppingList._id !== id) {
      throw new BadRequest("Shopping list id does not match param id");
    }
    await checkIfUserIsAllowed(user, id, this.usersService);

    try {
      return await this.shoppingListService.save(shoppingList);
    } catch (e) {
      $log.error(e);
      throw e;
    }
  }
}
