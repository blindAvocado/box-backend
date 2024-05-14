import { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import * as TokenService from "../services/token";
import { Forbidden, Unauthorized } from "../utils/errors";

interface IAuthReq extends Request {
  user: string | JwtPayload
}

export const checkAccess = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(" ")?.[1];

  if (!token) {
    return next(new Unauthorized());
  }

  try {
    const _userfromtoken = await TokenService.verifyAccessToken(token);
    console.log(_userfromtoken);
  } catch (error) {
    console.log(error);
    return next(new Forbidden());
  }

  next();
};