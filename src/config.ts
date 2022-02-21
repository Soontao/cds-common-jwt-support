// @ts-nocheck
import { VerifyConfig } from "./interface";

// TODO, configure by env or default env ?
export const store: { initialized: boolean, config: VerifyConfig } = {
  initialized: false,
  config: {}
};


export const setConfig = (config: VerifyConfig) => {
  store.config = config;
  store.initialized = true;
};


