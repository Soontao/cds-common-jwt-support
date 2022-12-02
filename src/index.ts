/* eslint-disable max-len */
import { cwdRequireCDS } from "cds-internal-tool";
import type { NextFunction, Request, Response } from "express";
import { errors, importPKCS8, importSPKI, importX509, jwtVerify } from "jose";
import { EXPRESS_APP_COMMON_JWT_CONFIG_KEY } from "./constants";
import { UnauthorizedError } from "./errors";
import { DefaultRoleExtractor, DefaultTenantExtractor, DefaultUserIdExtractorBuilder } from "./extractors";
import { CommonJwtConfig } from "./interface";


const middleware = async (req: Request, res: Response, next: NextFunction) => {
  const cds = cwdRequireCDS();

  try {

    const config: CommonJwtConfig = cds?.app?.get(EXPRESS_APP_COMMON_JWT_CONFIG_KEY) ?? {};

    if (config.key === undefined) {
      const alg = cds.env.get("requires.auth.credentials.alg") ?? "RS256";
      const publicKey = cds.env.get("requires.auth.credentials.public") as { spki?: string, x509?: string, pkcs8?: string };
  
      for (const [format, content] of Object.entries(publicKey)) {
        switch (format) {
          case "spki":
            config.key = await importSPKI(content, alg);
            break;
          case "x509":
            config.key = await importX509(content, alg);
            break;
          case "pkcs8":
            config.key = await importPKCS8(content, alg);
            break;
          default:
            break;
        }
        if (config.key !== undefined) {
          break;
        }
      }
      cds.app.set(EXPRESS_APP_COMMON_JWT_CONFIG_KEY, config);
    }
  
    if (config.key === undefined) {
      throw cds.error("public key is not configured");
    }
    
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
    req.user = new cds.User({
      id: userIdExtractor(jwt),
      jwt,
      req,
      attr: {},
      tenant: (config?.tenantExtractor ?? DefaultTenantExtractor)(jwt),
      roles: {
        ...(config?.roleExtractor ?? DefaultRoleExtractor)(jwt),
        "identified-user": true,
        "authenticated-user": true,
      }
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
