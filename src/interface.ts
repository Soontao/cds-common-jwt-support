import type { JWTVerifyOptions, JWTVerifyResult, KeyLike } from "jose";

export type JwtExtractor<R> = (jwt: JWTVerifyResult) => R;

export type RolesExtractor = JwtExtractor<{ [role: string]: boolean }>;

export type UserIdExtractor = JwtExtractor<string | undefined>;

export type TenantExtractor = JwtExtractor<string | null>

export interface VerifyConfig {
  key: KeyLike;
  options?: JWTVerifyOptions;
  userIdExtractor?: string | UserIdExtractor;
  roleExtractor?: RolesExtractor;
  tenantExtractor?: TenantExtractor;
}
