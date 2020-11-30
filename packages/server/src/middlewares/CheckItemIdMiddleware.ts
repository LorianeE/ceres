import {Middleware, PathParams, BodyParams} from "@tsed/common";
import {BadRequest} from "@tsed/exceptions";
import {ShoppingItem} from "../models/ShoppingItem";

@Middleware()
export class CheckItemIdMiddleware {
  async use(@PathParams("itemId") itemId: string, @BodyParams(ShoppingItem) item: ShoppingItem): Promise<void> {
    if (item._id !== itemId) {
      throw new BadRequest("Item id does not match param id");
    }
  }
}
