// @ts-ignore
import cds from "@sap/cds/lib";
import { baseConfig } from "./shared";

describe("Feature Toggle Test Suite", () => {

  const axios = cds.test(".").in(__dirname, "app");

  it("should could be started", async () => {
    const { data } = await axios.get(`/browse/$metadata`, baseConfig);
    expect(data).toMatch(/Books/);
  });

});
