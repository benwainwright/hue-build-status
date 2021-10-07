import { HueClient, DEVICE_TYPE } from "./client";
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

      bridge.post("/api", `{"devicetype":"${DEVICE_TYPE}"}`).reply(200, [
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

  describe("post", () => {
    it("if no password is passed in, it gets one from the bridge and uses it in the request, then returns the response", async () => {
      const testUsername = "foo-username";

      const bridge = nock("http://123.123.123.123");

      bridge.post("/api", `{"deviceType":"${DEVICE_TYPE}"}`).reply(200, [
        {
          success: {
            username: testUsername
          }
        }
      ]);

      const expectedResult = { foo: "bar" };

      bridge
        .post(`/api/${testUsername}/foo-bar`, { foo: "bar" })
        .reply(200, expectedResult);

      const client = new HueClient("123.123.123.123");

      const actual = await client.post("/foo-bar", { foo: "bar" });

      expect(actual).toEqual(expectedResult);
    });
  });
});
