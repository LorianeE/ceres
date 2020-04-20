import {ExpressApplication} from "@tsed/common";
import {TestContext} from "@tsed/testing";
import * as SuperTest from "supertest";
import {Server} from "../Server";

describe("Products", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(TestContext.bootstrap(Server));
  beforeEach(TestContext.inject([ExpressApplication], (expressApplication: ExpressApplication) => {
    request = SuperTest(expressApplication);
  }));
  afterEach(TestContext.reset);

  describe("GET /rest/products", () => {
    it("should return all products", async () => {
      const response = await request.get("/rest/products/").expect(200);

      // expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
