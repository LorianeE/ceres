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
import {ShoppingList} from "../../../src/models/ShoppingList";
import {ShoppingListService} from "../../../src/services/ShoppingListService";

describe("ShoppingListItems", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let product: Product;
  let dbUser: User;
  let userId: string;
  let shoppingList: ShoppingList;
  let shoppingListId: string;

  beforeAll(TestMongooseContext.bootstrap(Server));
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  beforeAll(
    TestMongooseContext.inject(
      [PassportMiddleware, UsersService, ProductsService, ShoppingListService],
      async (
        passportMiddleware: PassportMiddleware,
        usersService: UsersService,
        productsService: ProductsService,
        shoppingListService: ShoppingListService
      ) => {
        // Create new product and put it in DB
        const pdct = new Product();
        pdct.label = "Pommes";
        pdct.shelf = ShelfTypes.PRODUCE;
        product = await productsService.save(pdct);

        // Create new shopping list and put it in DB
        const list = new ShoppingList();
        shoppingList = await shoppingListService.save(list);

        shoppingListId = shoppingList._id.toString();

        // Create new user and put it in DB
        const user = new User();
        user.lastName = "Doe";
        user.firstName = "John";
        user.facebookId = "facebookId";
        user.shoppingLists = [shoppingList._id];
        dbUser = await usersService.create(user);

        userId = dbUser._id.toString();

        jest.spyOn(passportMiddleware, "use").mockImplementation(async (ctx: PlatformContext) => {
          ctx.getRequest().user = dbUser;
        });
      }
    )
  );
  afterAll(TestMongooseContext.reset);

  describe("Adding an time to a shoppinglist and update and delete it", () => {
    let itemId: string;
    it("should add item", async () => {
      // FIRST SAVE THE SHOPPING LIST
      const shoppingItem = {
        product: product._id.toString(),
        quantity: 1
      };
      const responsePost = await request
        .post(`/rest/users/${userId}/shopping-lists/${shoppingListId}/items`)
        .send(shoppingItem)
        .expect(201);
      itemId = responsePost.body.id;

      // Then check it is in shoppinglist
      const responseGet = await request.get(`/rest/users/${userId}/shopping-lists/${shoppingListId}`).expect(200);
      expect(responseGet.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: itemId
          })
        ])
      );
    });
    it("should update item", async () => {
      // THEN UPDATE IT
      const updatedItem = {
        id: itemId,
        product: product._id.toString(),
        quantity: 2,
        comment: "This is a comment"
      };
      await request.put(`/rest/users/${userId}/shopping-lists/${shoppingListId}/items/${itemId}`).send(updatedItem).expect(200);
      // Check if it was updated
      const updatedListResponse = await request.get(`/rest/users/${userId}/shopping-lists/${shoppingListId}`).expect(200);
      expect(updatedListResponse.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: itemId,
            quantity: 2,
            comment: "This is a comment"
          })
        ])
      );
    });
    it("should delete item", async () => {
      // THEN UPDATE IT
      await request.delete(`/rest/users/${userId}/shopping-lists/${shoppingListId}/items/${itemId}`).expect(204);
      // Check if it was deleted
      const updatedListResponse = await request.get(`/rest/users/${userId}/shopping-lists/${shoppingListId}`).expect(200);
      expect(updatedListResponse.body.items).toEqual([]);
    });
  });
});
