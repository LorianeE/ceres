import {ExpressApplication} from "@tsed/common";
import * as SuperTest from "supertest";
import {Server} from "../../../src/Server";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {ShelfTypes} from "../../../src/models/ShelfTypes";

describe("ShoppingLists", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(TestMongooseContext.bootstrap(Server));
  beforeEach(TestMongooseContext.inject([ExpressApplication], (expressApplication: ExpressApplication) => {
    request = SuperTest(expressApplication);
  }));
  afterEach(TestMongooseContext.reset);

  describe("Adding a shoppinglist to DB and retrieve it", () => {
    it("should add and return the shopping list", async () => {
      // FIRST SAVE THE SHOPPING LIST
      const shoppingItem = {
        product: {
          id: "apple",
          label: "Pommes",
          shelf: ShelfTypes.PRODUCE
        },
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
        ...shoppingList
      };
      expectedShoppingList.items[0].product.minimumQuantity = 0;
      expect(responseGet.body).toEqual(expectedShoppingList);
    });
  });
});
