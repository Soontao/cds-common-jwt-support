// @ts-nocheck
import type { NextFunction, Request, Response } from "express";
import { errors, jwtVerify } from "jose";
import { UnauthorizedError } from "./errors";
import { VerifyConfig } from "./interface";
import { DefaultRoleExtractor } from "./roles";
import { JwtUser } from "./user";

const middleware = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const config: VerifyConfig = req.app.get("cds-common-jwt-config");

    if (config === undefined) {
      throw new UnauthorizedError("the configuration of cds-common-jwt-support is not setup");
    }

    if (!req.headers?.authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Bearer token not found");
    }

    const token = req.headers.authorization.substring(7);
    const jwt = await jwtVerify(token, config.key, config.options);

    req.user = new JwtUser({
      id: jwt.payload?.sub ?? "unknown-authenticated-user",
      jwt,
      req,
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

export = middleware
