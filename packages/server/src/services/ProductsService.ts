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
    return this.product.find({}).exec();
  }

  /**
   *
   * @param product
   * @returns {Promise<Product>}
   */
  async save(product: Product): Promise<Product> {
    const model = new this.product(product);
    try {
      await model.save();

      return model;
    } catch (err) {
      if (err.code === 11000) {
        const duplicateKeyError = new DuplicateKeyError();
        duplicateKeyError.message = err.errmsg;
        throw duplicateKeyError;
      }
      throw err;
    }
  }
}
