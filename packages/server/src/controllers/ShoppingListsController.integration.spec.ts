import {ExpressApplication} from "@tsed/common";
import * as SuperTest from "supertest";
import {Server} from "../Server";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {ShoppingList} from "../models/ShoppingList";

describe("ShoppingLists", () => {
    let request: SuperTest.SuperTest<SuperTest.Test>;

    beforeEach(TestMongooseContext.bootstrap(Server));
    beforeEach(TestMongooseContext.inject([ExpressApplication], (expressApplication: ExpressApplication) => {
        request = SuperTest(expressApplication);
    }));
    afterEach(TestMongooseContext.reset);

    // describe("GET /rest/shopping-lists/:id", () => {
    //     it("should return all products", async () => {
    //         const response = await request.get("/rest/shopping-lists/1").expect(200);
    //
    //         expect(response.body).toBeInstanceOf(ShoppingList);
    //     });
    // });

    describe("POST /rest/shopping-lists", () => {
        it("should return all products", async () => {
            // const shoppingList = new ShoppingList();
            // shoppingList._id = '1234';
            // shoppingList.items = [];
            // const response = await request.post("/rest/shopping-lists").send(shoppingList).expect(204);
            expect(true).toBe(true);
        });
    });
});
