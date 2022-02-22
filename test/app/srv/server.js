const cds = require("@sap/cds");
const { getPublicKey } = require("../../shared");

cds.on("bootstrap", async (app) => {
  app.set("cds-common-jwt-config", {
    key: await getPublicKey()
  });
});

module.exports = cds.server;
