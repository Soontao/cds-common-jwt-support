# cds common jwt support

> support `jwt` without xsuaa ans xssec, and give user much more features with [`jose`](https://github.com/panva/jose)

[![node-test](https://github.com/Soontao/cds-common-jwt-support/actions/workflows/nodejs.yml/badge.svg)](https://github.com/Soontao/cds-common-jwt-support/actions/workflows/nodejs.yml)
[![codecov](https://codecov.io/gh/Soontao/cds-common-jwt-support/branch/main/graph/badge.svg?token=LKyd87mOZw)](https://codecov.io/gh/Soontao/cds-common-jwt-support)
[![npm](https://img.shields.io/npm/v/cds-common-jwt-support)](https://www.npmjs.com/package/cds-common-jwt-support)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Soontao_cds-common-jwt-support&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Soontao_cds-common-jwt-support)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Soontao_cds-common-jwt-support&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Soontao_cds-common-jwt-support)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Soontao_cds-common-jwt-support&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Soontao_cds-common-jwt-support)


## Get Started

> simply integrate the `cds-common-jwt-support` to you CAP nodejs project


```bash
npm i -S cds-common-jwt-support jose
```

`server.js`


```js
const cds = require("@sap/cds");
const { configureJwt } = require("cds-common-jwt-support");
const jose = require("jose")

const publicKey = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7g4mOYr136bOzOB4hd+e
......
-----END PUBLIC KEY-----
`

cds.on("bootstrap", async (app) => {
  configureJwt(app, {
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
      "kind": "common-jwt"
    },
    "kinds": {
      "common-jwt": {
        "impl": "cds-common-jwt-support"
      }
    }
  }
}
```

## [CHANGELOG](./CHANGELOG.md)

## [LICENSE](./LICENSE)
