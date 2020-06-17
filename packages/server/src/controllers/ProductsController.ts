import {BodyParams, Controller, Get, Post, Status} from "@tsed/common";
import {Summary} from "@tsed/swagger";
import {Product} from "../models/Product";
import {ProductsService} from "../services/ProductsService";

@Controller("/products")
export class ProductsController {
  constructor(private productsService: ProductsService) {
  }

  @Get("/")
  @Summary("Get all generic products from database")
  @Status(200)
  async getGenerics(): Promise<Product[]> {
    return this.productsService.findAllGenerics();
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
