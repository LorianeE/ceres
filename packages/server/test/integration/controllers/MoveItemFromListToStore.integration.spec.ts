import {PlatformTest} from "@tsed/common";
import * as SuperTest from "supertest";
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
import {ShoppingList} from "../../../src/models/ShoppingList";
import {ShoppingListService} from "../../../src/services/ShoppingListService";
import {ShoppingItem} from "../../../src/models/ShoppingItem";

describe("Move Item from List to Store", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let dbUser: User;
  let userId: string;
  let product: Product;
  let product2: Product;
  let shoppingList: ShoppingList;
  let firstItemId: string;
  let secondItemId: string;

  beforeAll(TestMongooseContext.bootstrap(Server));
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  beforeAll(
    TestMongooseContext.inject(
      [PassportMiddleware, UsersService, ProductsService, StoreService, ShoppingListService],
      async (
        passportMiddleware: PassportMiddleware,
        usersService: UsersService,
        productsService: ProductsService,
        storeService: StoreService,
        shoppingListService: ShoppingListService
      ) => {
        // Create new product and put it in DB
        const pdct = new Product();
        pdct.label = "Pommes";
        pdct.shelf = ShelfTypes.PRODUCE;
        product = await productsService.save(pdct);
        const pdct2 = new Product();
        pdct2.label = "Poires";
        pdct2.shelf = ShelfTypes.PRODUCE;
        product2 = await productsService.save(pdct2);

        // Create shopping list:
        // shopItem1 with quantity 2 and product already in store
        // shopItem2 with quantity 1 and product not in store
        const shopItem1 = new ShoppingItem();
        shopItem1.product = product._id.toString();
        shopItem1.quantity = 2;
        shopItem1.comment = "Comment";
        const shopItem2 = new ShoppingItem();
        shopItem2.product = product2._id.toString();
        shopItem2.quantity = 1;
        shopItem2.comment = "Comment 2";
        const list = new ShoppingList();
        list.items = [shopItem1, shopItem2];
        shoppingList = await shoppingListService.save(list);

        // @ts-ignore
        firstItemId = shoppingList.items.find((e) => e.product.toString() === product._id.toString())._id;
        // @ts-ignore
        secondItemId = shoppingList.items.find((e) => e.product.toString() === product2._id.toString())._id;

        // Create new user and put it in DB
        const user = new User();
        user.lastName = "Doe";
        user.firstName = "John";
        user.facebookId = "facebookId";
        user.shoppingLists = [shoppingList._id];
        dbUser = await usersService.create(user);

        userId = dbUser._id.toString();

        // Create store
        const item = new StoreItem();
        item.product = product._id.toString();
        item.quantity = 1;
        const store = new Store();
        store.items = [item];
        await storeService.addStoreForUser(userId, store);

        jest.spyOn(passportMiddleware, "use").mockImplementation((req) => {
          req.user = dbUser;
        });
      }
    )
  );
  afterAll(TestMongooseContext.reset);

  it("should call moveItem for first item with quantity 1 and get 204", async () => {
    await request
      .post(`/rest/users/${userId}/shopping-lists/${shoppingList._id.toString()}/items/${firstItemId.toString()}/store`)
      .send({quantityToMove: 1})
      .expect(204);
  });
  it("should get store and see that the item quantity is up to 1 (so 2 in total)", async () => {
    const response = await request.get(`/rest/users/${userId}/store`).expect(200);
    const userStore = response.body as Store;
    const itemToCheck = userStore.items.find((e: StoreItem) => e.product.toString() === product._id.toString());
    expect(itemToCheck?.quantity).toEqual(2);
  });
  it("should get shopping list and see that the item quantity is down to 1 (so 1 in total)", async () => {
    const response = await request.get(`/rest/users/${userId}/shopping-lists/${shoppingList._id.toString()}`).expect(200);
    const shopList = response.body as Store;
    const itemToCheck = shopList.items.find((e: StoreItem) => e.product.toString() === product._id.toString());
    expect(itemToCheck?.quantity).toEqual(1);
  });
  it("should call moveItem for second item with quantity 1 and get 204", async () => {
    await request
      .post(`/rest/users/${userId}/shopping-lists/${shoppingList._id.toString()}/items/${secondItemId.toString()}/store`)
      .send({quantityToMove: 1})
      .expect(204);
  });
  it("should get store and see that the item quantity is 1", async () => {
    const response = await request.get(`/rest/users/${userId}/store`).expect(200);
    const userStore = response.body as Store;
    const itemToCheck = userStore.items.find((e: StoreItem) => e.product.toString() === product2._id.toString());
    expect(itemToCheck?.quantity).toEqual(1);
  });
  it("should get shopping list and see that the item is not here anymore", async () => {
    const response = await request.get(`/rest/users/${userId}/shopping-lists/${shoppingList._id.toString()}`).expect(200);
    const shopList = response.body as Store;
    const itemToCheck = shopList.items.find((e: StoreItem) => e.product.toString() === product2._id.toString());
    expect(itemToCheck).toEqual(undefined);
  });
});
