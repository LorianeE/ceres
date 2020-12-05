import {Middleware, PathParams, BodyParams} from "@tsed/common";
import {BadRequest} from "@tsed/exceptions";
import {Product} from "../models/Product";

@Middleware()
export class CheckProductIdMiddleware {
  async use(@PathParams("productId") productId: string, @BodyParams(Product) product: Product): Promise<void> {
    if (product._id !== productId) {
      throw new BadRequest("Product id does not match param id");
    }
  }
}
