// @ts-nocheck
import type { JWTVerifyResult } from "jose";

const cds = require("@sap/cds");

export interface JwtUserOptions {
  id: string;
  jwt: JWTVerifyResult;
  req?: import("express").Request;
  attr?: any;
  tenant?: string | null;
  roles?: { [role: string]: boolean };
}

/**
 * cds-common-jwt User
 */
export class JwtUser extends cds.User {

  #jwt: JWTVerifyResult;

  #roles: { [role: string]: boolean } = {};

  #req: import("express").Request;

  #attr: any = {};

  #tenant: string = null;

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
    if (typeof options.tenant === "string") {
      this.#tenant = options.tenant;
    }
    if (options.attr !== undefined) {
      this.#attr = options.attr;
    }
  }

  public get tenant() {
    return this.#tenant;
  }

  public set tenant(val: any) {
    this.#tenant = val;
  }

  public get _jwt() {
    return this.#jwt;
  }

  public get _req() {
    return this.#req;
  }

  public get attr() {
    return this.#attr;
  }

  public get _roles() {
    return this.#roles;
  }

  public is(role: string) {
    return this.#roles?.[role] === true;
  }

}
