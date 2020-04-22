import {BodyParams, Controller, Get, Post, Status} from "@tsed/common";
import {Summary} from "@tsed/swagger";
import Product from "../models/Product";
import {ProductsService} from "../services/ProductsService";

@Controller("/products")
export class ProductsController {
  constructor(private productsService: ProductsService) {
  }

  @Get("/")
  @Summary("Get all products from database")
  @Status(200)
  async get(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Post("/")
  @Summary("Add products to database")
  @Status(204)
  async addProducts(@BodyParams(Product) products: Product[]) {
    const promises = products.map(async (product) => {
      await this.productsService.save(product);
    });

    return await Promise.all(promises);
  }
}
