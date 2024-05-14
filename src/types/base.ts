import { FingerprintResult } from "express-fingerprint";

export interface IRequest {
  fingerprint: FingerprintResult | undefined;
}

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export interface ITokenPayload {
  id: number;
  username: string;
  hashedPassword: string;
  iat: number;
  exp: number;
}

export interface IAction {
  // event: IActionType;
  value?: number | string;
  // date: string | Date;
  target: {
    type: "episode" | "show" | "user";
    id: number;
    customData?: any;
  };
}

export type IActionType =
  | "WATCH_STATUS"
  | "RATE"
  | "WATCH"
  | "RATE_WATCH"
  | "CREATE_LIST"
  | "UPDATE_LIST"
  | "FOLLOW"
  | "UNFOLLOW"
  | "COMMENT"
  | "LIKE"
  | "LOGIN"
  | "LOGOUT";
