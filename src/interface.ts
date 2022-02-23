import type { JWTVerifyOptions, JWTVerifyResult, KeyLike } from "jose";

export type JwtExtractor<R> = (jwt: JWTVerifyResult) => R;

/**
 * extract user.roles from jwt token
 */
export type RolesExtractor = JwtExtractor<{ [role: string]: boolean }>;

/**
 * extract user.id from jwt token
 */
export type UserIdExtractor = JwtExtractor<string | undefined>;

/**
 * extract tenant information from jwt token, if single tenant application, please return 'null'
 */
export type TenantExtractor = JwtExtractor<string | null>

export interface CommonJwtConfig {
  /**
   * jwt verify key
   */
  key: KeyLike;
  /**
   * jwt verify options
   * 
   * @see [JWTVerifyOptions](https://github.com/panva/jose/blob/main/docs/interfaces/jwt_verify.JWTVerifyOptions.md)
   */
  options?: JWTVerifyOptions;
  userIdExtractor?: string | UserIdExtractor;
  roleExtractor?: RolesExtractor;
  tenantExtractor?: TenantExtractor;
}
