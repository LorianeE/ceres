import {BodyParams, Controller, Get, PathParams, Put, UseBefore, UseBeforeEach} from "@tsed/common";
import {ShoppingListService} from "../services/ShoppingListService";
import {Returns, Summary} from "@tsed/schema";
import {Authenticate} from "@tsed/passport";
import {CheckIsAllowedUserShopListMiddleware} from "../middlewares/CheckIsAllowedUserShopListMiddleware";
import {ShoppingList} from "../models/ShoppingList";
import {NotFound} from "@tsed/exceptions";
import {CheckShoppingListIdMiddleware} from "../middlewares/CheckShoppingListIdMiddleware";
import {ShoppingListItemsController} from "./ShoppingListItemsController";

@Controller({
  path: "/shopping-lists",
  children: [ShoppingListItemsController]
})
@Authenticate("facebook")
@UseBeforeEach(CheckIsAllowedUserShopListMiddleware)
export class ShoppingListsController {
  constructor(private shoppingListService: ShoppingListService) {}

  @Get("/:shoppingListId")
  @Summary("Get shopping list from a user")
  @UseBefore(CheckIsAllowedUserShopListMiddleware)
  @Returns(200, ShoppingList)
  async get(@PathParams("shoppingListId") shoppingListId: string): Promise<ShoppingList> {
    const shoppingList = await this.shoppingListService.find(shoppingListId);
    if (!shoppingList) {
      throw new NotFound("Could not find shopping list");
    }

    return shoppingList;
  }

  @Put("/:shoppingListId")
  @Summary("Update shopping list from a user")
  @UseBefore(CheckIsAllowedUserShopListMiddleware)
  @UseBefore(CheckShoppingListIdMiddleware)
  @Returns(200, ShoppingList)
  async update(
    @PathParams("shoppingListId") shoppingListId: string,
    @BodyParams(ShoppingList) shoppingList: ShoppingList
  ): Promise<ShoppingList> {
    return this.shoppingListService.save(shoppingList);
  }
}
