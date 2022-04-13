import { RolesExtractor, TenantExtractor, UserIdExtractor } from "./interface";

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
      if (jwt.payload.roles instanceof Object) {
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


export const DefaultTenantExtractor: TenantExtractor = (jwt) => {
  switch (typeof jwt?.payload?.tenant) {
    case "number":
      return String(jwt.payload.tenant);
    case "string":
      return jwt.payload.tenant;
    default:
      return null;
  }
};


export const DefaultUserIdExtractorBuilder = (key: string): UserIdExtractor => {
  return (jwt) => {
    const userId = jwt?.payload?.[key];
    if (userId === undefined) {
      return userId;
    }
    if (typeof userId === "string") {
      return userId;
    }
    if (typeof userId === "number") {
      return String(userId);
    }
  };
};
