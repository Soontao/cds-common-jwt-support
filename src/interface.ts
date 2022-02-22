import type { JWTVerifyOptions, JWTVerifyResult, KeyLike } from "jose";

export type RolesExtractor = (jwt: JWTVerifyResult) => { [role: string]: boolean }

export interface VerifyConfig {
  key: KeyLike;
  options?: JWTVerifyOptions;
  roleExtractor?: RolesExtractor;
}
