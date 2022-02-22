import { TenantExtractor } from "./interface";

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
