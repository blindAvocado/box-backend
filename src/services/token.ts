import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { FingerprintResult } from "express-fingerprint";
import { db } from "../utils/db.server";

interface IRefresh {
  id: number;
  refreshToken: string;
  fingerprint: FingerprintResult | undefined;
}

dotenv.config();

export const createRefreshSession = async (payload: IRefresh) => {
  await db.refreshSession.create({
    data: {
      user_id: payload.id,
      refresh_token: payload.refreshToken,
      fingerprint: payload.fingerprint?.hash || "hash",
    },
  });
};

export const deleteRefreshSession = async (refreshToken: string) => {
  await db.refreshSession.delete({
    where: {
      refresh_token: refreshToken,
    },
  });
};

export const getRefreshSession = async (refreshToken: string) => {
  const response = await db.refreshSession.findUnique({
    where: {
      refresh_token: refreshToken,
    },
  });

  if (!response) {
    return null;
  }

  return response;
};

export const verifyRefreshToken = async (refreshToken: string) => {
  return await jwt.verify(refreshToken, (process.env.JWT_REFRESH_SECRET as string))
}

export const verifyAccessToken = async (refreshToken: string) => {
  return await jwt.verify(refreshToken, (process.env.JWT_ACCESS_SECRET as string))
} 
