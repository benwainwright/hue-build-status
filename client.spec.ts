import { HueClient } from "./client";
import nock from "nock";

beforeEach(() => {
  nock.disableNetConnect();
});

afterEach(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

describe("the hue client", () => {
  describe("get", () => {
    it("if no password is passed in, it gets one from the bridge and uses it in the request, then returns the response", async () => {
      const testUsername = "foo-username";

      const bridge = nock("http://123.123.123.123");

      bridge.post("/api", '{"deviceType":"hue-build-status"}').reply(200, [
        {
          success: {
            username: testUsername
          }
        }
      ]);

      const expectedResult = { foo: "bar" };

      bridge.get(`/api/${testUsername}/foo-bar`).reply(200, expectedResult);

      const client = new HueClient("123.123.123.123");

      const actual = await client.get("/foo-bar");

      expect(actual).toEqual(expectedResult);
    });
  });
});
