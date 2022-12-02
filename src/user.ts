// @ts-nocheck
import type { JWTVerifyResult } from "jose";

export interface JwtUserOptions {
  id: string | undefined;
  jwt: JWTVerifyResult;
  req?: import("express").Request;
  attr?: any;
  tenant?: string | null;
  roles?: { [role: string]: boolean };
}


