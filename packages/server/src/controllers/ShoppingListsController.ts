import {$log, BodyParams, Context, Controller, Get, PathParams, Post, Put, Req, Status} from "@tsed/common";
import {Returns, Summary} from "@tsed/swagger";
import {BadRequest, NotFound, Unauthorized} from "ts-httpexceptions";
import {ShoppingList} from "../models/ShoppingList";
import {ShoppingListService} from "../services/ShoppingListService";
import {Authenticate} from "@tsed/passport";
import User from "../models/User";

// TODO: Make a middleware of it
function checkIfUserIsAllowed(user: User, shoppingListId: string) {
  if (!user.shoppingListIds.includes(shoppingListId)) {
    throw new Unauthorized("Shopping list id does not match user's shopping lists.");
  }
}

@Controller("/shopping-lists")
export class ShoppingListsController {
  constructor(private shoppingListService: ShoppingListService) {
  }

  @Get("/:id")
  @Summary("Get a specific shopping list")
  @Authenticate("facebook")
  @Status(200)
  @Returns(ShoppingList)
  async get(@Context() context: Context, @PathParams("id") id: string, @Req("user") user: User): Promise<ShoppingList> {
    checkIfUserIsAllowed(user, id);
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
  async create(@BodyParams(ShoppingList) shoppingList: ShoppingList) {
    try {
      return await this.shoppingListService.save(shoppingList);
    } catch (e) {
      $log.error(e);
      throw e;
    }
  }

  @Put("/:id")
  @Summary("Update a specific shopping list")
  @Authenticate("facebook")
  @Status(204)
  async update(@PathParams("id") id: string, @BodyParams(ShoppingList) shoppingList: ShoppingList, @Req("user") user: User) {
    if (shoppingList._id !== id) {
      throw new BadRequest("Shopping list id does not match param id");
    }
    checkIfUserIsAllowed(user, id);

    try {
      return await this.shoppingListService.save(shoppingList);
    } catch (e) {
      $log.error(e);
      throw e;
    }
  }
}
