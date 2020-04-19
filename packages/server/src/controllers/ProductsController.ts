import {BodyParams, Controller, Get, Post, Status} from "@tsed/common";
import {Summary} from "@tsed/swagger";
import {BadRequest} from "ts-httpexceptions";
import {Product} from "../models/Product";
import {DuplicateKeyError} from "../services/errors/DuplicateKeyError";
import {ProductsService} from "../services/ProductsService";

@Controller("/products")
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get("/")
  @Summary("Get all products from database")
  async get(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Post("/")
  @Summary("Add products to database")
  @Status(204)
  async addProducts(@BodyParams(Product) products: Product[]) {
    try {
      const promises = products.map(async (product) => {
        await this.productsService.save(product);
      });
      await Promise.all(promises);
    } catch (err) {
      if (err instanceof DuplicateKeyError) {
        throw new BadRequest(err.message);
      }
      throw err;
    }
  }
}
