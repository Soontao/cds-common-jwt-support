// @ts-nocheck
import type { JWTVerifyResult } from "jose";

const cds = require("@sap/cds");



export interface JwtUserOptions {
  id: string;
  jwt: JWTVerifyResult;
  req?: import("express").Request;
  roles?: Set<string>;
}

/**
 * cds-common-jwt User
 */
export class JwtUser extends cds.User {

  #jwt: JWTVerifyResult;

  #roles: { [role: string]: boolean };

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
    if (this.id !== undefined && this.id?.length > 0) {
      this.#roles["identified-user"] = true;
    }
    this.#roles["authenticated-user"] = true;
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
    return this.#roles?.[role] === true;
  }

}
