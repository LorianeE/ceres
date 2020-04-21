import {$log, BodyParams, Context, Controller, Get, PathParams, Post, Put, Status} from "@tsed/common";
import {Returns, Summary} from "@tsed/swagger";
import {BadRequest, NotFound} from "ts-httpexceptions";
import {ShoppingList} from "../models/ShoppingList";
import {ShoppingListService} from "../services/ShoppingListService";

@Controller("/shopping-lists")
export class ShoppingListsController {
  constructor(private shoppingListService: ShoppingListService) {}

  @Get("/:id")
  @Summary("Get a specific shopping list")
  @Status(200)
  @Returns(ShoppingList)
  async get(@Context() context: Context, @PathParams("id") id: string): Promise<ShoppingList> {
    const shoppingList = await this.shoppingListService.find(id);
    if (!shoppingList) {
      throw new NotFound("Could not find shopping list");
    }

    return shoppingList;
  }

  @Post("/")
  @Summary("Post a shopping list")
  @Status(204)
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
  @Status(204)
  async update(@PathParams("id") id: string, @BodyParams(ShoppingList) shoppingList: ShoppingList) {
    if (shoppingList._id !== id) {
      throw new BadRequest("Shopping list id does not match with param id");
    }
    try {
      return await this.shoppingListService.save(shoppingList);
    } catch (e) {
      $log.error(e);
      throw e;
    }
  }
}
