import type { NextFunction, Request, Response } from "express";
import { errors, jwtVerify } from "jose";
import { EXPRESS_APP_COMMON_JWT_CONFIG_KEY } from "./constants";
import { UnauthorizedError } from "./errors";
import { DefaultRoleExtractor, DefaultTenantExtractor, DefaultUserIdExtractorBuilder } from "./extractors";
import { CommonJwtConfig } from "./interface";
import { JwtUser } from "./user";


const middleware = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const config: CommonJwtConfig = req?.app?.get(EXPRESS_APP_COMMON_JWT_CONFIG_KEY);

    if (config === undefined) {
      throw new UnauthorizedError("the configuration of cds-common-jwt-support is not setup");
    }

    if (!req.headers?.authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Bearer token not found");
    }

    const token = req.headers.authorization.substring(7);
    const jwt = await jwtVerify(token, config.key, config.options);

    let userIdExtractor = DefaultUserIdExtractorBuilder("sub"); // default, extract user.id from jwt.sub claim

    if (typeof config.userIdExtractor === "string") {
      userIdExtractor = DefaultUserIdExtractorBuilder(config.userIdExtractor);
    }
    if (typeof config.userIdExtractor === "function") {
      userIdExtractor = config.userIdExtractor;
    }

    // @ts-ignore
    req.user = new JwtUser({
      id: userIdExtractor(jwt),
      jwt,
      req,
      attr: {},
      tenant: (config?.tenantExtractor ?? DefaultTenantExtractor)(jwt),
      roles: (config?.roleExtractor ?? DefaultRoleExtractor)(jwt)
    });

    return next();

  } catch (error) {

    if (error instanceof errors.JOSEError) {
      return res
        .status(401)
        .json({
          error: {
            code: `${error?.code ?? 401}`,
            message: error?.message
          }
        });
    }


    return res
      .status(error?.statusCode ?? 500)
      .json({
        error: {
          code: `${error?.statusCode ?? 500}`,
          message: error?.message
        }
      });

  }

};


/**
 * configure cds common jwt verify logic
 * 
 * @param app express app
 * @param config 
 * @returns app
 * 
 * @example
 * ```ts
 * cds.on("bootstrap", async (app) => {
 *  configureJwt(app, {
 *  key: await jose.importSPKI(publicKey, "PS256")
 *  });
 * });
 * ```
 * 
 */
function configureJwt(app: import("express").Application, config: CommonJwtConfig) {
  // TODO: validate config
  app.set(EXPRESS_APP_COMMON_JWT_CONFIG_KEY, config);
  return app;
};

middleware.configureJwt = configureJwt;

export = middleware
