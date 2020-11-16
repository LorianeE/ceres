import {PlatformTest} from "@tsed/common";
import * as SuperTest from "supertest";
import {Server} from "../../../src/Server";
import {TestMongooseContext} from "@tsed/testing-mongoose";

describe("Products", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(TestMongooseContext.bootstrap(Server));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterEach(TestMongooseContext.reset);

  describe("GET /rest/products", () => {
    it("should return all products", async () => {
      const response = await request.get("/rest/products").expect(200);
      expect(response.body).toEqual([]);
    });
  });
});
