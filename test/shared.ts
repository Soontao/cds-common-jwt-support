import fs from "fs/promises";
import * as jose from "jose";
import path from "path";

export const baseConfig = {
  validateStatus: function (status: any) {
    return status >= 200 && status < 500;
  },
};

export const buildAuthConfig = async (tokenPayload?: jose.JWTPayload, validity?: number) => {
  return {
    ...baseConfig,
    headers: {
      Authorization: `Bearer ${await createAuthToken(tokenPayload, validity)}`
    }
  };
};


export const createAuthToken = async (payload: jose.JWTPayload = { sub: "test-user" }, validity = 60) => {
  return new jose
    .SignJWT(payload)
    .setIssuedAt()
    .setProtectedHeader({ alg: "RS256" })
    .setExpirationTime(Math.floor(Date.now() / 1000) + validity) // 60 seconds exp
    .sign(await getPrivateKey());
};


export const getPublicKey = () => {
  return fs.readFile(
    path.join(__dirname, "./resources/publicKey.pem"),
    { encoding: "utf-8" }
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
