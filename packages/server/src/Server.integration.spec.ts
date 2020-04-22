import {ExpressApplication} from "@tsed/common";
import * as SuperTest from "supertest";
import {Server} from "./Server";
import {TestMongooseContext} from "@tsed/testing-mongoose";

describe("Server", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(TestMongooseContext.bootstrap(Server));
  beforeEach(
      TestMongooseContext.inject([ExpressApplication], (expressApplication: ExpressApplication) => {
      request = SuperTest(expressApplication);
    })
  );

  afterEach(TestMongooseContext.reset);

  it("should call GET / and return 200", async () => {
    const response = await request.get("/").expect(200);
  });
});
