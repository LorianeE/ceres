import {Controller, Get} from "@tsed/common";
import {Product} from "../models/Product";

export const products = [
  new Product("baconStrips", "Lardons", "cold"),
  new Product("cider", "Cidre", "drinks"),
  new Product("apple", "Pommes", "produce"),
  new Product("pear", "Poires", "produce"),
  new Product("pineapple", "Ananas", "produce"),
  new Product("bigCreamJar", "Gros pot de crème", "cold"),
  new Product("smokedHam-4", "Jambon fumé - 4 tranches", "cold")
];

@Controller("/products")
export class ProductsController {
  @Get("/")
  async get(): Promise<Product[]> {
    return products;
  }
}
