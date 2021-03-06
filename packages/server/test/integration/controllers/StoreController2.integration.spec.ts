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
  let dbUser2: User;
  let product: Product;
  let dbStore: Store;

  beforeAll(TestMongooseContext.bootstrap(Server));
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  beforeAll(
    TestMongooseContext.inject(
      [UsersService, ProductsService, StoreService],
      async (usersService: UsersService, productsService: ProductsService, storeService: StoreService) => {
        // Create new product and put it in DB
        const pdct = new Product();
        pdct.label = "Pommes";
        pdct.shelf = ShelfTypes.PRODUCE;
        product = await productsService.save(pdct);

        // Create new Store
        const item = new StoreItem();
        item.product = product._id;
        item.quantity = 2;

        const store = new Store();
        store.items = [item];

        dbStore = await storeService.save(store);

        // Create new user and put it in DB
        const user = new User();
        user.lastName = "Doe";
        user.firstName = "John";
        user.facebookId = "facebookId";
        dbUser = await usersService.create(user);

        const user2 = new User();
        user2.lastName = "Doe";
        user2.firstName = "Jane";
        user2.facebookId = "fbId";
        user2.store = dbStore._id;
        dbUser2 = await usersService.create(user2);
      }
    )
  );
  afterAll(TestMongooseContext.reset);

  describe("Manipulate a user's store", () => {
    beforeEach(
      TestMongooseContext.inject([PassportMiddleware], async (passportMiddleware: PassportMiddleware) => {
        jest.spyOn(passportMiddleware, "use").mockImplementation(async (ctx: PlatformContext) => {
          ctx.getRequest().user = dbUser;
        });
      })
    );
    it("should get user store and get BadRequest", async () => {
      await request.get(`/rest/stores/1234`).expect(400);
    });
    it("should get user store and get NotFound", async () => {
      await request.get(`/rest/stores/551137c2f9e1fac808a5f572`).expect(404);
    });
    it("should post user store with store already existing", async () => {
      const store = {
        id: dbStore._id,
        items: dbStore.items
      };
      const response = await request.post(`/rest/users/${dbUser._id}/store`).send(store).expect(201);
      const userStore = response.body;
      expect(userStore.items[0].product).toEqual(product._id.toString());
      expect(userStore.items[0].quantity).toEqual(2);

      // Store is here for user1
      const {body: storeForUser1} = await request.get(`/rest/stores/${userStore.id}`).expect(200);
      expect(storeForUser1.id).toEqual(dbStore._id.toString());
    });
  });
  describe("Verify store is still here for user 2", () => {
    beforeEach(
      TestMongooseContext.inject([PassportMiddleware], async (passportMiddleware: PassportMiddleware) => {
        jest.spyOn(passportMiddleware, "use").mockImplementation(async (ctx: PlatformContext) => {
          ctx.getRequest().user = dbUser2;
        });
      })
    );
    it("should get user 2 store", async () => {
      const {body: storeForUser2} = await request.get(`/rest/stores/${dbStore._id}`).expect(200);
      expect(storeForUser2.id).toEqual(dbStore._id.toString());
    });
  });
});
