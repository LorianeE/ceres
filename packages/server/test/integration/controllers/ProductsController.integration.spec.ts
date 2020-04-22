import {ExpressApplication} from "@tsed/common";
import * as SuperTest from "supertest";
import {Server} from "../../../src/Server";
import {TestMongooseContext} from "@tsed/testing-mongoose";

describe("Products", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(TestMongooseContext.bootstrap(Server));
  beforeEach(TestMongooseContext.inject([ExpressApplication], (expressApplication: ExpressApplication) => {
    request = SuperTest(expressApplication);
  }));
  afterEach(TestMongooseContext.reset);

  describe("GET /rest/products", () => {
    it("should return all products", async () => {
      const response = await request.get("/rest/products").expect(200);
      expect(response.body).toEqual([]);
    });
  });
});
