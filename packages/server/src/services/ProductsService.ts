import {Inject, Service} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {NotFound} from "@tsed/exceptions";
import {Product} from "../models/Product";
import {DuplicateKeyError} from "./errors/DuplicateKeyError";

@Service()
export class ProductsService {
  @Inject(Product)
  private product: MongooseModel<Product>;

  async findById(id: string): Promise<Product | null> {
    return this.product.findById(id).exec();
  }

  async findAll(): Promise<Product[]> {
    return this.product.find().exec();
  }

  /**
   * Find all generic products, i.e. all products without any associated userId.
   * @returns {undefined|Product[]}
   */
  async findAllGenerics(): Promise<Product[]> {
    return this.product
      .find({
        $or: [
          {
            users: {$exists: false}
          },
          {
            users: {$size: 0}
          }
        ]
      })
      .exec();
  }

  /**
   * Find all products for a specific user.
   * @returns {undefined|Product[]}
   */
  async findUsersProducts(userId: string): Promise<Product[]> {
    return this.product.find({users: userId}).exec();
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

  /**
   * Update label, shelf and minimumQuantity for a product.
   * @param product
   * @param userId
   */
  async updateProduct(product: Product, userId: string): Promise<Product> {
    const filter = {
      $and: [
        {
          _id: product._id
        },
        {
          users: userId
        }
      ]
    };
    const dbProduct = await this.product
      .findOneAndUpdate(
        filter,
        {
          $set: {
            label: product.label,
            shelf: product.shelf,
            minimumQuantity: product.minimumQuantity
          }
        },
        {
          new: true
        }
      )
      .exec();
    if (dbProduct) {
      return dbProduct;
    }
    throw new NotFound("Could not find given product for this user");
  }

  /**
   * Add a product to database and attach it to given user. If the product already exists, it only attach user to it.
   * @param userId
   * @param product
   */
  async addUserToProduct(userId: string, product: Product): Promise<Product> {
    const productDoc = await this.product.findById(product._id);
    if (productDoc) {
      return this.product.findOneAndUpdate({_id: product._id}, {$push: {users: userId}}, {new: true, upsert: true}).exec();
    } else {
      const newProduct = new this.product(product);
      newProduct.users.push(userId);
      return newProduct.save();
    }
  }

  /**
   * Remove a product from a user's list. If the product does not belong to any user after this, it is deleted.
   * @param productId
   * @param userId
   */
  async removeProductFromUser(productId: string, userId: string): Promise<void> {
    const product = await this.product
      .findOne({
        $and: [
          {
            _id: productId
          },
          {
            users: userId
          }
        ]
      })
      .exec();
    if (!product) {
      throw new NotFound("Could not find given product for this user");
    }
    product.users = product.users.filter((el) => el.toString() !== userId);
    await product.save();
    // If users is empty, it means that the product is not associated with any user anymore,
    // so we can remove it.
    if (!product.users.length) {
      await this.product.deleteOne({_id: product._id}).exec();
    }
  }
}
