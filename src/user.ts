// @ts-nocheck
import cds from "@sap/cds";
import type { JWTVerifyResult } from "jose";



export interface JwtUserOptions {
  id: string;
  jwt: JWTVerifyResult;
  req?: import("express").Request;
  roles?: Set<string>;
}

export class JwtUser extends cds.User {

  #jwt: JWTVerifyResult;

  #roles: Set<string>;

  #req: import("express").Request;

  constructor(options: JwtUserOptions) {
    super(options.id);
    this.#jwt = options.jwt;
    if (options.req !== undefined) {
      this.#req = options.req;
    }
    if (options.roles !== undefined) {
      this.#roles = options.roles;
    }
  }

  public get _jwt() {
    return this.#jwt;
  }

  public get _req() {
    return this.#req;
  }

  public get _roles() {
    return this.#roles;
  }

  public is(role: string) {
    return this.#roles.has(role);
  }

}
