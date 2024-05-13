import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { FingerprintResult } from "express-fingerprint";
import { db } from "../utils/db.server";

interface IRefresh {
  id: number,
  refreshToken: string,
  fingerprint: FingerprintResult | undefined,
}

dotenv.config();

export const createRefreshSession = async (payload: IRefresh) => {
  await db.refreshSession.create({
    data: {
      user_id: payload.id,
      refresh_token: payload.refreshToken,
      fingerprint: payload.fingerprint?.hash || 'hash'
    }
  })
};

export const deleteRefreshSession = async (refreshToken: string) => {
  await db.refreshSession.delete({
    where: {
      refresh_token: refreshToken
    }
  })
};

