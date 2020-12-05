import {BodyParams, Controller, Delete, PathParams, Post, Put, UseBefore, UseBeforeEach} from "@tsed/common";
import {ShoppingListService} from "../services/ShoppingListService";
import {Returns, Summary} from "@tsed/schema";
import {Authenticate} from "@tsed/passport";
import {CheckIsAllowedUserMiddleware} from "../middlewares/CheckIsAllowedUserMiddleware";
import {ShoppingItem} from "../models/ShoppingItem";
import {CheckItemIdMiddleware} from "../middlewares/CheckItemIdMiddleware";
import {PostShoppingItem} from "../models/PostShoppingItem";

@Controller("/:shoppingListId/items")
@Authenticate("facebook")
@UseBeforeEach(CheckIsAllowedUserMiddleware)
export class ShoppingListItemsController {
  constructor(private shoppingListService: ShoppingListService) {}

  @Post("/")
  @Summary("Post a new item in shopping list")
  @Returns(201, ShoppingItem)
  async create(
    @BodyParams(PostShoppingItem) item: PostShoppingItem,
    @PathParams("shoppingListId") shoppingListId: string
  ): Promise<ShoppingItem> {
    return this.shoppingListService.addItem(shoppingListId, item as ShoppingItem);
  }

  @Put("/:itemId")
  @UseBefore(CheckItemIdMiddleware)
  @Summary("Update shopping list item. If quantity for item to update is <= 0, item is deleted.")
  @Returns(200, ShoppingItem)
  async update(
    @PathParams("shoppingListId") shoppingListId: string,
    @BodyParams(ShoppingItem) item: ShoppingItem
  ): Promise<ShoppingItem | null> {
    return this.shoppingListService.updateItem(shoppingListId, item);
  }

  @Delete("/:itemId")
  @Summary("Remove an item in a shopping list")
  @Returns(204)
  async removeItem(@PathParams("itemId") itemId: string, @PathParams("shoppingListId") shoppingListId: string): Promise<void> {
    return this.shoppingListService.deleteItem(shoppingListId, itemId);
  }
}
