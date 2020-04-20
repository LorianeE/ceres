import {PlatformApplication} from "@tsed/common";
import {TestContext} from "@tsed/testing";
import * as SuperTest from "supertest";
import {Server} from "./Server";

describe("Server", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(TestContext.bootstrap(Server));
  beforeEach(
    TestContext.inject([PlatformApplication], (app: PlatformApplication) => {
      request = SuperTest(app.raw);
    })
  );

  afterEach(TestContext.reset);

  it("should call GET /rest and return 404", async () => {
    const response = await request.get("/rest").expect(404);
  });
});
