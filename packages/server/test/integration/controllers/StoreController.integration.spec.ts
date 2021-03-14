import {PlatformContext, PlatformTest} from "@tsed/common";
import SuperTest from "supertest";
import {Server} from "../../../src/Server";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {PassportMiddleware} from "@tsed/passport";
import {UsersService} from "../../../src/services/users/UsersService";
import {User} from "../../../src/models/User";
import {StoreItem} from "../../../src/models/StoreItem";
import {Store} from "../../../src/models/Store";
import {Product} from "../../../src/models/Product";
import {ShelfTypes} from "../../../src/models/ShelfTypes";
import {ProductsService} from "../../../src/services/ProductsService";

describe("Store", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let dbUser: User;
  let userId: string;
  let product: Product;

  beforeAll(TestMongooseContext.bootstrap(Server));
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  beforeAll(
    TestMongooseContext.inject(
      [PassportMiddleware, UsersService, ProductsService],
      async (passportMiddleware: PassportMiddleware, usersService: UsersService, productsService: ProductsService) => {
        // Create new user and put it in DB
        const user = new User();
        user.lastName = "Doe";
        user.firstName = "John";
        user.facebookId = "facebookId";
        dbUser = await usersService.create(user);

        userId = dbUser._id.toString();

        // Create new product and put it in DB
        const pdct = new Product();
        pdct.label = "Pommes";
        pdct.shelf = ShelfTypes.PRODUCE;
        product = await productsService.save(pdct);

        jest.spyOn(passportMiddleware, "use").mockImplementation(async (ctx: PlatformContext) => {
          ctx.getRequest().user = dbUser;
        });
      }
    )
  );
  afterAll(TestMongooseContext.reset);

  describe("Manipulate a user's store", () => {
    let userStore: any;
    let itemId: string;
    it("should get user store and get NotFound", async () => {
      await request.get(`/rest/users/${userId}/store`).expect(404);
    });
    it("should post user store", async () => {
      const store = new Store();
      store.items = [];

      const response = await request.post(`/rest/users/${userId}/store`).send(store).expect(201);
      userStore = response.body as Store;
      expect(userStore.items).toEqual([]);
    });
    it("should get user store", async () => {
      const response = await request.get(`/rest/users/${userId}/store`).expect(200);
      expect(response.body).toEqual(userStore);
    });
    it("should post item to store", async () => {
      const item = new StoreItem();
      item.product = product._id;
      item.quantity = 2;
      const response = await request.post(`/rest/users/${userId}/store/${userStore.id}/items`).send(item).expect(201);
      expect(response.body.product).toEqual(product._id.toString());
      itemId = response.body.id;
    });
    it("should get user store with item", async () => {
      const response = await request.get(`/rest/users/${userId}/store`).expect(200);
      expect(response.body.items[0].product).toEqual(product._id.toString());
      expect(response.body.items[0].quantity).toEqual(2);
    });
    it("should update item", async () => {
      // THEN UPDATE IT
      const updatedItem = {
        id: itemId,
        product: product._id,
        quantity: 1
      };
      await request.put(`/rest/users/${userId}/store/${userStore.id}/items/${itemId}`).send(updatedItem).expect(200);
      // Check if it was updated
      const updatedResponse = await request.get(`/rest/users/${userId}/store`).expect(200);
      expect(updatedResponse.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: itemId,
            quantity: 1
          })
        ])
      );
    });
    it("should delete the item", async () => {
      await request.delete(`/rest/users/${userId}/store/${userStore.id}/items/${itemId}`).expect(204);
      // Check if it was deleted
      const response = await request.get(`/rest/users/${userId}/store`).expect(200);
      expect(response.body.items).toEqual([]);
    });
  });
});
