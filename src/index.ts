// @ts-nocheck
import type { NextFunction, Request, Response } from "express";
import { errors, jwtVerify } from "jose";
import { store } from "./config";
import { UnauthorizedError } from "./errors";
import { JwtUser } from "./user";

const middleware = async (req: Request, res: Response, next: NextFunction) => {

  try {
    if (store.initialized === false) {
      throw new UnauthorizedError("the configuration of cds-common-jwt-support is not setup");
    }
    if (!req.headers?.authorization?.startsWith("Bearer")) {
      throw new UnauthorizedError("Bearer token not found");
    }
    const token = req.headers.authorization.substr(7);
    const jwt = await jwtVerify(token, store.config.key, store.config.options);

    req.user = new JwtUser({
      id: result.payload.sub,
      jwt: jwt,
      roles: store.config?.roleExtractor?.(jwt) ?? new Set()
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
