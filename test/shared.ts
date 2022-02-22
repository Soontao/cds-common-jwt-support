import fs from "fs/promises";
import * as jose from "jose";
import path from "path";

export const baseConfig = {
  validateStatus: function (status: any) {
    return status >= 200 && status < 500;
  },
};

export const buildAuthConfig = async (tokenPayload = { sub: "test-user" }) => {
  return {
    ...baseConfig,
    headers: {
      Authorization: `Bearer ${await createAuthToken(tokenPayload)}`
    }
  };
};


export const createAuthToken = async (payload = { sub: "test-user" }) => {
  return new jose
    .SignJWT(payload)
    .setIssuedAt()
    .setProtectedHeader({ alg: "PS256" })
    .setExpirationTime(Math.floor(Date.now() / 1000) + 60) // 60 seconds exp
    .sign(await getPrivateKey());
};


export const getPublicKey = async () => {
  return await jose.importSPKI(
    await fs.readFile(
      path.join(__dirname, "./resources/publicKey.pem"),
      { encoding: "utf-8" }
    ),
    "PS256"
  );
};


export const getPrivateKey = async () => {
  return await jose.importPKCS8(
    await fs.readFile(
      path.join(__dirname, "./resources/privateKey.pem"),
      { encoding: "utf-8" }
    ),
    "PS256"
  );
};
