import {BodyParams, Controller, Get, Post, QueryParams} from "@tsed/common";
import {Groups, Returns, Summary} from "@tsed/schema";
import {Product} from "../models/Product";
import {ProductsService} from "../services/ProductsService";

@Controller("/products")
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get("/")
  @Summary("Get all products from database")
  @(Returns(200, Array).Of(Product))
  async getAllProducts(@QueryParams("genericsOnly") genericsOnly: boolean): Promise<Product[]> {
    if (genericsOnly) {
      return this.productsService.findAllGenerics();
    }
    return this.productsService.findAll();
  }

  @Post("/")
  @Summary("Add products to database")
  @(Returns(201, Array).Of(Product))
  async addProducts(@BodyParams(Product) @Groups("creation") products: Product[]): Promise<Product[]> {
    const promises = products.map((product) => {
      return this.productsService.save(product);
    });

    return Promise.all(promises);
  }
}
