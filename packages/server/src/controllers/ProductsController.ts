import {BodyParams, Controller, Get, Post} from "@tsed/common";
import {Returns, Summary} from "@tsed/schema";
import {Product} from "../models/Product";
import {ProductsService} from "../services/ProductsService";

@Controller("/products")
export class ProductsController {
  constructor(private productsService: ProductsService) {
  }

  @Get("/")
  @Summary("Get all generic products from database")
  @Returns(200, Array).Of(Product)
  async getGenerics(): Promise<Product[]> {
    return this.productsService.findAllGenerics();
  }

  @Post("/")
  @Summary("Add products to database")
  @Returns(204)
  async addProducts(@BodyParams(Product) products: Product[]) {
    const promises = products.map(async (product) => {
      await this.productsService.save(product);
    });

    return await Promise.all(promises);
  }
}
