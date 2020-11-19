import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {Product} from "../models/Product";
import {DuplicateKeyError} from "./errors/DuplicateKeyError";

@Service()
export class ProductsService {
  @Inject(Product)
  private product: MongooseModel<Product>;

  /**
   * Find all products.
   * @returns {undefined|Product[]}
   */
  async findAll(): Promise<Product[]> {
    return this.product.find({});
  }

  /**
   *
   * @param product
   * @returns {Promise<Product>}
   */
  async save(product: Product): Promise<Product> {
    const model = new this.product(product);
    try {
      return await model.save();
    } catch (err) {
      if (err.code === 11000) {
        throw DuplicateKeyError.from(err);
      }
      throw err;
    }
  }
}
