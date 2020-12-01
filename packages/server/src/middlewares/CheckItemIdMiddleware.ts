import {Middleware, PathParams, BodyParams} from "@tsed/common";
import {BadRequest} from "@tsed/exceptions";

@Middleware()
export class CheckItemIdMiddleware {
  async use(@PathParams("itemId") itemId: string, @BodyParams("id") itemIdInBody: string): Promise<void> {
    if (itemIdInBody !== itemId) {
      throw new BadRequest("Item id does not match param id");
    }
    if (!itemId.match("^[0-9a-fA-F]{24}$")) {
      throw new BadRequest("INVALID_ITEM_ID");
    }
  }
}
