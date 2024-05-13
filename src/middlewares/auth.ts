import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export const checkAccess = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(" ")?.[1];

  if (!token) {
    return next(res.status(401));
  }
  
  jwt.verify(token, (process.env.JWT_ACCESS_SECRET as string), (error, user) => {
    console.log("🚀 ~ checkAccess ~ error, user:", error, user);

    if (error) {
      return next(res.status(403).json(error));
    }

    req.user = user;
  })
};