import { isPlainObject } from "@newdash/newdash/isPlainObject";
import { RolesExtractor } from "./interface";

/**
 * extract custom `roles` claims as roles
 * 
 * @param jwt 
 * @returns 
 */
export const DefaultRoleExtractor: RolesExtractor = (jwt) => {
  switch (typeof jwt?.payload?.roles) {
    case "object":
      if (jwt.payload.roles instanceof Array) {
        // @ts-ignore
        return jwt?.payload?.roles?.reduce?.((pre, cur) => { pre[cur] = true; return pre; }, {});
      }
      if (isPlainObject(jwt.payload.roles)) {
        return jwt.payload.roles;
      }
      return {};
    case "string":
      // @ts-ignore
      return jwt?.payload?.roles?.split(",").reduce?.((pre, cur) => { pre[cur] = true; return pre; }, {});
    default:
      return {};
  }
};
