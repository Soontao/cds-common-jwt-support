# cds common jwt support

> support `jwt` without xsuaa ans xssec, and give user much more features with [`jose`](https://github.com/panva/jose)

[![node-test](https://github.com/Soontao/cds-common-jwt-support/actions/workflows/nodejs.yml/badge.svg)](https://github.com/Soontao/cds-common-jwt-support/actions/workflows/nodejs.yml)
[![codecov](https://codecov.io/gh/Soontao/cds-common-jwt-support/branch/main/graph/badge.svg?token=LKyd87mOZw)](https://codecov.io/gh/Soontao/cds-common-jwt-support)


## Get Started

> simply integrate the `cds-common-jwt-support` to you CAP nodejs project


```bash
npm i -S cds-common-jwt-support
```


`server.js`


```ts
const cds = require("@sap/cds");
const jose = require("jose")

const publicKey = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7g4mOYr136bOzOB4hd+e
......
-----END PUBLIC KEY-----
`

cds.on("bootstrap", async (app) => {
  app.set("cds-common-jwt-config", {
    key: await jose.importSPKI(publicKey, "PS256")
  });
});

module.exports = cds.server;
```

`package.json`

```json
{
  "requires": {
    "auth": {
      "impl": "cds-common-jwt-support"
    }
  }
}
```

## [CHANGELOG](./CHANGELOG.md)

## [LICENSE](./LICENSE)
