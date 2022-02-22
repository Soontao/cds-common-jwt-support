const cds = require("@sap/cds");
const { getPublicKey } = require("../../shared");
const { configureJwt } = require("../../../src");

cds.on("bootstrap", async (app) => {
  configureJwt(app, {
    key: await getPublicKey(),
  });
});

module.exports = cds.server;
