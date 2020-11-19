import {BodyParams, Controller, Get, Post} from "@tsed/common";
import {Returns, Summary} from "@tsed/schema";
import {Product} from "../models/Product";
import {ProductsService} from "../services/ProductsService";

@Controller("/products")
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get("/")
  @Summary("Get all products from database")
  @(Returns(200, Array).Of(Product))
  async get(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Post("/")
  @Summary("Add products to database")
  @(Returns(201, Array).Of(Product))
  async addProducts(@BodyParams(Product) products: Product[]): Promise<Product[]> {
    const promises = products.map((product) => {
      return this.productsService.save(product);
    });

    return Promise.all(promises);
  }
}
