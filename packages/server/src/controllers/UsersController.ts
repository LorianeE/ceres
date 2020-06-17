import {$log, BodyParams, Controller, Delete, Get, PathParams, Post, Put, Req, Status} from "@tsed/common";
import {Returns, Summary} from "@tsed/swagger";
import {Unauthorized} from "ts-httpexceptions";
import {Authenticate} from "@tsed/passport";
import User from "../models/User";
import {Product} from "../models/Product";
import {ProductsService} from "../services/ProductsService";

// TODO: Make a middleware of it
async function checkIfUserIsAllowed(user: User, userId: string) {
  if (user._id !== userId) {
    throw new Unauthorized("User id does not match with authorized user.");
  }
}

@Controller("/users")
export class UsersController {
  constructor(private productsService: ProductsService) {
  }

  @Get("/:id/products")
  @Summary("Get user's products")
  @Authenticate("facebook")
  @Status(200)
  async getProducts(@PathParams("id") userId: string, @Req("user") user: User): Promise<Product[]> {
    await checkIfUserIsAllowed(user, userId);

    return this.productsService.findUsersProducts(user._id);
  }

  @Post("/:id/products")
  @Summary("Add a product to a user's list")
  @Authenticate("facebook")
  @Status(201)
  async addProduct(@PathParams("id") userId: string, @BodyParams(Product) product: Product, @Req("user") user: User) {
    await checkIfUserIsAllowed(user, userId);
    try {
      product.userIds.push(user._id);

      return this.productsService.save(product);
    } catch (e) {
      $log.error(e);
      throw e;
    }
  }

  @Put("/:userId/products/:productId")
  @Summary("Update a product from a user's products list")
  @Authenticate("facebook")
  @Status(200)
  @Returns(Product)
  async updateProduct(@PathParams("userId") userId: string, @PathParams("productId") productId: string, @BodyParams(Product) product: Product, @Req("user") user: User) {
    await checkIfUserIsAllowed(user, userId);

    return this.productsService.updateProduct(product, userId);
  }

  @Delete("/:userId/products/:productId")
  @Summary("Remove a product from a user's products list")
  @Authenticate("facebook")
  @Status(200)
  async removeProduct(@PathParams("userId") userId: string, @PathParams("productId") productId: string, @Req("user") user: User) {
    await checkIfUserIsAllowed(user, userId);

    return this.productsService.removeUserFromProduct(productId, userId);
  }
}
