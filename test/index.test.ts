// @ts-ignore
import cds from "@sap/cds/lib";
import { baseConfig, buildAuthConfig } from "./shared";

describe("Feature Toggle Test Suite", () => {

  const axios = cds.test(".").in(__dirname, "app");

  it("should could be started & reject request without token", async () => {
    const r0 = await axios.get(`/browse/$metadata`, baseConfig);
    expect(r0.status).toBe(401);
  });

  it("should could be started & reject request without token", async () => {
    const { data } = await axios.get(`/browse/$metadata`, await buildAuthConfig());
    expect(data).toMatch(/Books/);
  });

});
