import {PlatformTest} from "@tsed/common";
import * as SuperTest from "supertest";
import {Server} from "../../../src/Server";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {PassportMiddleware} from "@tsed/passport";
import {UsersService} from "../../../src/services/users/UsersService";
import {User} from "../../../src/models/User";
import {ShelfTypes} from "../../../src/models/ShelfTypes";
import {ProductsService} from "../../../src/services/ProductsService";
import {Product} from "../../../src/models/Product";

describe("ShoppingLists", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let product: Product;
  let dbUser: User;
  let userId: string;

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

        jest.spyOn(passportMiddleware, "use").mockImplementation((req) => {
          req.user = dbUser;
        });
      }
    )
  );
  afterAll(TestMongooseContext.reset);

  describe("Adding a shoppinglist to DB and retrieve it", () => {
    let shoppingListId: string;
    let newShoppingListResponse: any;
    it("should create new shopping list", async () => {
      // FIRST SAVE THE SHOPPING LIST
      const shoppingItem = {
        product: product._id.toString(),
        quantity: 1
      };
      const shoppingList = {
        items: [shoppingItem]
      };
      const responsePost = await request.post(`/rest/users/${userId}/shopping-lists`).send(shoppingList).expect(201);
      shoppingListId = responsePost.body.id;
    });
    it("should retrieve new shopping list", async () => {
      // THEN RETRIEVE IT
      newShoppingListResponse = await request.get(`/rest/users/${userId}/shopping-lists/${shoppingListId}`).expect(200);
      expect(newShoppingListResponse.body.id).toEqual(shoppingListId);
      expect(newShoppingListResponse.body.items[0].product).toEqual(product._id.toString());
      expect(newShoppingListResponse.body.items[0].quantity).toEqual(1);
    });
    it("should update the shopping list", async () => {
      // THEN UPDATE IT
      const updatedList = {
        ...newShoppingListResponse.body,
        items: [
          {
            product: product._id.toString(),
            quantity: 2
          }
        ]
      };
      const responsePut = await request.put(`/rest/users/${userId}/shopping-lists/${shoppingListId}`).send(updatedList).expect(200);
      expect(responsePut.body.id).toEqual(shoppingListId);
      expect(responsePut.body.items[0].product).toEqual(product._id.toString());
      expect(responsePut.body.items[0].quantity).toEqual(2);
    });
  });
});
