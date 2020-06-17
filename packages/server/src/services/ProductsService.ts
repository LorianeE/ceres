import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {Product} from "../models/Product";
import {DuplicateKeyError} from "./errors/DuplicateKeyError";

@Service()
export class ProductsService {
  @Inject(Product)
  private product: MongooseModel<Product>;

  /**
   * Find all generic products, i.e. all products without any associated userId.
   * @returns {undefined|Product[]}
   */
  async findAllGenerics(): Promise<Product[]> {
    return this.product.find({
      $or: [
        {
          userIds: {$exists: false}
        },
        {
          userIds: {$size: 0}
        }
      ]
    });
  }

  /**
   * Find all products for a specific user.
   * @returns {undefined|Product[]}
   */
  async findUsersProducts(userId: string): Promise<Product[]> {
    return this.product.find({userIds: userId});
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
