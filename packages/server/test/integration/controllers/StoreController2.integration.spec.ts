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
import {StoreService} from "../../../src/services/StoreService";

describe("Store with store already existing with other user", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let dbUser: User;
  let userId: string;
  let userId2: string;
  let product: Product;
  let dbStore: Store;

  beforeAll(TestMongooseContext.bootstrap(Server));
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  beforeAll(
    TestMongooseContext.inject(
      [PassportMiddleware, UsersService, ProductsService, StoreService],
      async (
        passportMiddleware: PassportMiddleware,
        usersService: UsersService,
        productsService: ProductsService,
        storeService: StoreService
      ) => {
        // Create new user and put it in DB
        const user = new User();
        user.lastName = "Doe";
        user.firstName = "John";
        user.facebookId = "facebookId";
        dbUser = await usersService.create(user);

        userId = dbUser._id.toString();

        const user2 = new User();
        user2.lastName = "Doe";
        user2.firstName = "Jane";
        user2.facebookId = "fbId";
        const dbUser2 = await usersService.create(user2);

        userId2 = dbUser2._id.toString();

        // Create new product and put it in DB
        const pdct = new Product();
        pdct.label = "Pommes";
        pdct.shelf = ShelfTypes.PRODUCE;
        product = await productsService.save(pdct);

        // Create new Store for user 2
        const item = new StoreItem();
        item.product = product._id;
        item.quantity = 2;

        const store = new Store();
        store.items = [item];
        store.users.push(userId2);

        dbStore = await storeService.save(store);

        jest.spyOn(passportMiddleware, "use").mockImplementation(async (ctx: PlatformContext) => {
          ctx.getRequest().user = dbUser;
        });
      }
    )
  );
  afterAll(TestMongooseContext.reset);

  describe("Manipulate a user's store", () => {
    let userStore: Store;
    it("should get user store and get NotFound", async () => {
      await request.get(`/rest/users/${userId}/store`).expect(404);
    });
    it("should post user store with store already existing", async () => {
      const store = {
        id: dbStore._id,
        items: dbStore.items
      };
      const response = await request.post(`/rest/users/${userId}/store`).send(store).expect(201);
      userStore = response.body;
      expect(userStore.items[0].product).toEqual(product._id.toString());
      expect(userStore.items[0].quantity).toEqual(2);
      expect(userStore.users).toEqual([userId2, userId]);
    });
    it("should get user store", async () => {
      const response = await request.get(`/rest/users/${userId}/store`).expect(200);
      expect(response.body).toEqual(userStore);
    });
  });
});
