import type { JWTVerifyOptions, JWTVerifyResult, KeyLike } from "jose";

export type RolesExtractor = (jwt: JWTVerifyResult) => Set<string>

export interface VerifyConfig {
  key: KeyLike;
  options?: JWTVerifyOptions;
  roleExtractor?: RolesExtractor;
}
