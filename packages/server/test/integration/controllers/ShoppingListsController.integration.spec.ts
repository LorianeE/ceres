import {ExpressApplication} from "@tsed/common";
import * as SuperTest from "supertest";
import {Server} from "../../../src/Server";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {PassportMiddleware} from "@tsed/passport";
import {UsersService} from "../../../src/services/users/UsersService";
import User from "../../../src/models/User";
import {ShelfTypes} from "../../../src/models/ShelfTypes";
import {ProductsService} from "../../../src/services/ProductsService";
import Product from "../../../src/models/Product";

describe("ShoppingLists", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let product: Product;

  beforeEach(TestMongooseContext.bootstrap(Server));
  beforeEach(TestMongooseContext.inject([ExpressApplication, PassportMiddleware, UsersService, ProductsService],
    async (
      expressApplication: ExpressApplication,
      passportMiddleware: PassportMiddleware,
      usersService: UsersService,
      productsService: ProductsService
    ) => {

      // Create new user and put it in DB
      const user = new User();
      user.lastName = "Doe";
      user.firstName = "John";
      user.facebookId = "facebookId";
      const dbUser = await usersService.create(user);

      // Create new product and put it in DB
      const pdct = new Product();
      pdct.productId = "apple";
      pdct.label = "Pommes";
      pdct.shelf = ShelfTypes.PRODUCE;
      product = await productsService.save(pdct);

      jest.spyOn(passportMiddleware, "use").mockImplementation((req) => {
        req.user = dbUser;
      });

      request = SuperTest(expressApplication);
    }));
  afterEach(TestMongooseContext.reset);

  describe("Adding a shoppinglist to DB and retrieve it", () => {
    it("should add and return the shopping list", async () => {
      // FIRST SAVE THE SHOPPING LIST
      const shoppingItem = {
        product: product._id,
        quantity: 1
      };
      const shoppingList = {
        items: [shoppingItem]
      };
      const responsePost = await request.post("/rest/shopping-lists").send(shoppingList).expect(201);
      const shoppingListId = responsePost.body.id;

      // THEN RETRIEVE IT
      const responseGet = await request.get(`/rest/shopping-lists/${shoppingListId}`).expect(200);
      const expectedShoppingList: any = {
        id: shoppingListId,
        items: [
          {
            product: {
              id: product._id.toString(),
              label: "Pommes",
              minimumQuantity: 0,
              productId: "apple",
              shelf: ShelfTypes.PRODUCE,
            },
            quantity: 1
          }
        ]
      };
      expectedShoppingList.items[0].product.minimumQuantity = 0;
      expect(responseGet.body).toEqual(expectedShoppingList);
    });
  });
});
