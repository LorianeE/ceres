import {Middleware, PathParams, BodyParams} from "@tsed/common";
import {BadRequest} from "@tsed/exceptions";
import {ShoppingList} from "../models/ShoppingList";

@Middleware()
export class CheckShoppingListIdMiddleware {
  async use(@PathParams("shoppingListId") shoppingListId: string, @BodyParams(ShoppingList) shoppingList: ShoppingList): Promise<void> {
    if (shoppingList._id !== shoppingListId) {
      throw new BadRequest("Shopping list id does not match param id");
    }
  }
}
