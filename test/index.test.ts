// @ts-ignore
import cds from "@sap/cds/lib";
import { baseConfig, buildAuthConfig } from "./shared";

describe("Feature Toggle Test Suite", () => {

  const axios = cds.test(".").in(__dirname, "app");

  it("should could be started & reject request without token", async () => {
    const r0 = await axios.get(`/browse/$metadata`, baseConfig);
    expect(r0.status).toBe(401);
  });


  it("should could be started & reject request with token", async () => {
    const { data } = await axios.get(`/browse/$metadata`, await buildAuthConfig());
    expect(data).toMatch(/Books/);
  });

  it("should reject expired jwt token", async () => {
    const r0 = await axios.get("/browse/$metadata", await buildAuthConfig(undefined, -100));
    expect(r0.status).toBe(401);
    expect(r0.data.error.message).toBe("\"exp\" claim timestamp check failed");
  });


  it("should could be started & reject request without token", async () => {
    const { data, status } = await axios.get(`/browse/$metadata`, baseConfig);
    expect(status).toBe(401);
    expect(data.error.message).toBe("Bearer token not found");
  });

  it("should support extract roles default", async () => {
    const { data, status } = await axios.get(`/index/userInfo()`, await buildAuthConfig());
    expect(status).toBe(200);
    expect(data.id).toBe("test-user");
    expect(data.roles).toStrictEqual([
      "identified-user",
      "authenticated-user",
    ]);
  });

  it("should support extract roles array", async () => {
    const { data, status } = await axios.get(`/index/userInfo()`,
      await buildAuthConfig({ sub: "Theo Sun", roles: ["people1", "people2"] })
    );
    expect(status).toBe(200);
    expect(data.id).toBe("Theo Sun");
    expect(data.roles).toStrictEqual([
      "people1", "people2",
      "identified-user",
      "authenticated-user",
    ]);
  });

  it("should support extract roles string list", async () => {
    const { data, status } = await axios.get(`/index/userInfo()`,
      await buildAuthConfig({ sub: "Theo Sun", roles: "people1,people2" })
    );
    expect(status).toBe(200);
    expect(data.id).toBe("Theo Sun");
    expect(data.roles).toStrictEqual([
      "people1", "people2",
      "identified-user",
      "authenticated-user",
    ]);
  });

  it("should support extract roles object", async () => {
    const { data, status } = await axios.get(`/index/userInfo()`,
      await buildAuthConfig({ sub: "Theo Sun", roles: { people1: true, people2: true } })
    );
    expect(status).toBe(200);
    expect(data.id).toBe("Theo Sun");
    expect(data.roles).toStrictEqual([
      "people1", "people2",
      "identified-user",
      "authenticated-user",
    ]);
  });


});
