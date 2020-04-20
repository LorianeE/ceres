import {ExpressApplication} from "@tsed/common";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import * as SuperTest from "supertest";
import {Server} from "../Server";

describe("Products controller", () => {
    // bootstrap your Server to load all endpoints before run your test
    let request: SuperTest.SuperTest<SuperTest.Test>;

    // @ts-ignore
    beforeEach(TestMongooseContext.bootstrap(Server));
    beforeEach(TestMongooseContext.inject([ExpressApplication], (expressApplication: ExpressApplication) => {
        request = SuperTest(expressApplication);
    }));

    afterEach(TestMongooseContext.reset);

    describe("GET /rest/products", () => {
        it("should return an array of products", async () => {
            const response = await request.get("/rest/products").expect(200);
            // expect(Array.isArray(response.body)).toBe(true);
        });
    });
});
