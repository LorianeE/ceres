import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {Product} from "../models/Product";
import {DuplicateKeyError} from "./errors/DuplicateKeyError";
import {NotFound} from "ts-httpexceptions";

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

  async updateProduct(product: Product, userId: string) {
    const filter = {
      $and: [
        {
          _id: product._id
        },
        {
          userIds: userId
        },
      ]
    };
    const dbProduct = await this.product.findOneAndUpdate(filter, product);
    if (dbProduct) {
      return this.product.findOne(filter);
    }
    throw new NotFound("Could not find given product for this user");
  }

  async removeUserFromProduct(productId: string, userId: string) {
    const product = await this.product.findOne({
      $and: [
        {
          _id: productId
        },
        {
          userIds: userId
        },
      ]
    });
    if (product) {
      product.userIds = product.userIds.filter((el) => el !== userId);
      // If userIds is empty, it means that the product is not associated with any user anymore,
      // so we can remove it. If not, we update it to keep the association for the other involved users.
      if (!product.userIds.length) {
        return this.product.deleteOne({ _id: product._id });
      } else {
        return product.save();
      }
    }
    throw new NotFound("Could not find given product for this user");
  }
}
