import { JwtPayload } from "jsonwebtoken";
import * as express from "express"

declare namespace Express {
  export interface Request {
    user: string | JwtPayload
  }
}