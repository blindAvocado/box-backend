import { NextFunction, Request, Response } from "express";
import { type JwtPayload } from "jsonwebtoken";
import * as TokenService from "../services/token";
import { Forbidden, Unauthorized } from "../utils/errors";

export interface IAuthReq extends Request {
  user: string | JwtPayload
}

export const checkAccess = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  console.log("🚀 ~ checkAccess ~ authHeader:", authHeader)

  const token = authHeader?.split(" ")?.[1];

  if (!token) {
    return next(new Unauthorized());
  }

  try {
    const _userfromtoken = await TokenService.verifyAccessToken(token);

    //@ts-ignore
    req.user = _userfromtoken;
    
    console.log(_userfromtoken);
  } catch (error) {
    console.log(error);
    return next(new Forbidden());
  }

  next();
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(" ")?.[1];
  if (!token) {
    return next();
  }

  try {
    const _userfromtoken = await TokenService.verifyAccessToken(token);

    //@ts-ignore
    req.user = _userfromtoken;
    
    console.log(_userfromtoken);
  } catch (error) {
    console.log(error);
    return next();
  }

  next();
} 