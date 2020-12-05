import {BodyParams, Controller, Delete, Get, PathParams, Post, Put, UseBefore, UseBeforeEach} from "@tsed/common";
import {Returns, Summary} from "@tsed/schema";
import {Authenticate} from "@tsed/passport";
import {Product} from "../models/Product";
import {ProductsService} from "../services/ProductsService";
import {CheckUserIdMiddleware} from "../middlewares/CheckUserIdMiddleware";
import {CheckProductIdMiddleware} from "../middlewares/CheckProductIdMiddleware";

@Controller("/:userId/products")
@Authenticate("facebook")
@UseBeforeEach(CheckUserIdMiddleware)
export class UserProductsController {
  constructor(private productsService: ProductsService) {}

  @Get("/")
  @Summary("Get user's products")
  @(Returns(200, Array).Of(Product))
  async getProducts(@PathParams("userId") userId: string): Promise<Product[]> {
    return this.productsService.findUsersProducts(userId);
  }

  @Post("/")
  @Summary("Add a product to a user's list")
  @Returns(201, Product)
  async addProduct(@PathParams("userId") userId: string, @BodyParams(Product) product: Product): Promise<Product> {
    return this.productsService.addUserToProduct(userId, product);
  }

  @Put("/:productId")
  @UseBefore(CheckProductIdMiddleware)
  @Summary("Update a product from a user's products list")
  @Returns(200, Product)
  async updateProduct(
    @PathParams("userId") userId: string,
    @PathParams("productId") productId: string,
    @BodyParams(Product) product: Product
  ): Promise<Product> {
    return this.productsService.updateProduct(product, userId);
  }

  @Delete("/:productId")
  @Summary("Remove a product from a user's products list")
  @Returns(204)
  async removeProduct(@PathParams("userId") userId: string, @PathParams("productId") productId: string): Promise<void> {
    return this.productsService.removeProductFromUser(productId, userId);
  }
}
