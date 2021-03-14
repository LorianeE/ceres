import {PlatformContext, PlatformTest} from "@tsed/common";
import SuperTest from "supertest";
import {Server} from "../../../src/Server";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {PassportMiddleware} from "@tsed/passport";
import {UsersService} from "../../../src/services/users/UsersService";
import {User} from "../../../src/models/User";
import {ShelfTypes} from "../../../src/models/ShelfTypes";
import {ProductsService} from "../../../src/services/ProductsService";
import {Product} from "../../../src/models/Product";

describe("UsersProducts", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let product: Product;
  let apiInitialProduct: Record<string, unknown>;
  let dbUser: User;

  beforeEach(TestMongooseContext.bootstrap(Server));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });
  beforeEach(
    TestMongooseContext.inject(
      [PassportMiddleware, UsersService, ProductsService],
      async (passportMiddleware: PassportMiddleware, usersService: UsersService, productsService: ProductsService) => {
        // Create new user and put it in DB
        const user = new User();
        user.lastName = "Doe";
        user.firstName = "John";
        user.facebookId = "facebookId";
        dbUser = await usersService.create(user);

        // Create new product and put it in DB
        const pdct = new Product();
        pdct.label = "Pommes";
        pdct.shelf = ShelfTypes.PRODUCE;
        product = await productsService.save(pdct);

        apiInitialProduct = {
          id: product._id.toString(),
          label: product.label,
          minimumQuantity: product.minimumQuantity,
          shelf: product.shelf,
          users: []
        };

        jest.spyOn(passportMiddleware, "use").mockImplementation(async (ctx: PlatformContext) => {
          ctx.getRequest().user = dbUser;
        });
      }
    )
  );
  afterEach(TestMongooseContext.reset);

  describe("Complete sequence to manage a product which already exists for a user", () => {
    it("should manipulate user's product", async () => {
      // FIRST GET THE USER PRODUCTS: EMPTY ARRAY
      const responseGetEmpty = await request.get(`/rest/users/${dbUser._id.toString()}/products`).expect(200);
      expect(responseGetEmpty.body).toEqual([]);

      // THEN ADD A NEW PRODUCT BASED ON ONE ALREADY EXISTING
      const apiProduct = {
        id: product._id.toString(),
        label: product.label,
        shelf: product.shelf,
        minimumQuantity: product.minimumQuantity
      };
      const responsePost = await request.post(`/rest/users/${dbUser._id.toString()}/products`).send(apiProduct).expect(201);
      expect(responsePost.body.id).toEqual(product._id.toString());
      expect(responsePost.body.users[0]).toEqual(dbUser._id.toString());

      // THEN GET USER PRODUCTS LIST, NOT EMPTY
      const responseGetFull = await request.get(`/rest/users/${dbUser._id.toString()}/products`).expect(200);
      expect(responseGetFull.body).toEqual([
        {
          ...apiProduct,
          users: [dbUser._id.toString()]
        }
      ]);

      // THEN UPDATE IT (WITHOUT USERIDS BUT IT DOES NOT MATTER)
      const updatedApiProduct = {
        id: product._id.toString(),
        label: "newLabel",
        shelf: product.shelf,
        minimumQuantity: product.minimumQuantity
      };
      const responsePut = await request
        .put(`/rest/users/${dbUser._id.toString()}/products/${product._id.toString()}`)
        .send(updatedApiProduct)
        .expect(200);
      expect(responsePut.body.id).toEqual(product._id.toString());
      expect(responsePut.body.label).toEqual("newLabel");
      expect(responsePut.body.users[0]).toEqual(dbUser._id.toString());

      // THEN DELETE IT
      await request.delete(`/rest/users/${dbUser._id.toString()}/products/${product._id.toString()}`).expect(204);
      // THEN CHECK USER LIST, IT MUST BE DELETED
      const responseGetAfterDelete = await request.get(`/rest/users/${dbUser._id.toString()}/products`).expect(200);
      expect(responseGetAfterDelete.body).toEqual([]);
    });
  });
  describe("Sequence to manage a product which NOT already exists for a user", () => {
    it("should manipulate user's product", async () => {
      // FIRST GET THE USER PRODUCTS: EMPTY ARRAY
      const responseGetEmpty = await request.get(`/rest/users/${dbUser._id.toString()}/products`).expect(200);
      expect(responseGetEmpty.body).toEqual([]);

      // THEN ADD A NEW PRODUCT
      const newProduct = {
        label: "label",
        shelf: "cold"
      };
      const {body: addedProduct} = await request.post(`/rest/users/${dbUser._id.toString()}/products`).send(newProduct).expect(201);
      expect(addedProduct.label).toEqual("label");
      expect(addedProduct.shelf).toEqual("cold");
      expect(addedProduct.minimumQuantity).toEqual(0);
      expect(addedProduct.users[0]).toEqual(dbUser._id.toString());

      // THEN GET USER PRODUCTS LIST, NOT EMPTY
      const responseGetFull = await request.get(`/rest/users/${dbUser._id.toString()}/products`).expect(200);
      expect(responseGetFull.body[0].id).toEqual(addedProduct.id);
      expect(responseGetFull.body[0].users).toEqual([dbUser._id.toString()]);

      // CHECK THE PRODUCT IS IN DATABASE WITH INITIAL PRODUCT
      const {body: databaseProducts} = await request.get("/rest/products").expect(200);
      expect(databaseProducts).toEqual([apiInitialProduct, responseGetFull.body[0]]);

      // THEN DELETE IT
      await request.delete(`/rest/users/${dbUser._id.toString()}/products/${addedProduct.id}`).expect(204);
      // THEN CHECK USER LIST, IT MUST BE DELETED
      const responseGetAfterDelete = await request.get(`/rest/users/${dbUser._id.toString()}/products`).expect(200);
      expect(responseGetAfterDelete.body).toEqual([]);

      // FINALLY, CHECK THE PRODUCT IS NOT IN DATABASE ANYMORE, ONLY INITIAL PRODUCT IS
      const response = await request.get("/rest/products").expect(200);
      expect(response.body).toEqual([apiInitialProduct]);
    });
  });
});
