import type { JWTVerifyOptions, JWTVerifyResult, KeyLike } from "jose";

export type JwtExtractor<R> = (jwt: JWTVerifyResult) => R;

export type RolesExtractor = JwtExtractor<{ [role: string]: boolean }>;

export type TenantExtractor = JwtExtractor<string | null>

export interface VerifyConfig {
  key: KeyLike;
  options?: JWTVerifyOptions;
  roleExtractor?: RolesExtractor;
  tenantExtractor?: TenantExtractor;
}
