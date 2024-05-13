import type { IRequest } from "../types/base";
import bcrypt from "bcryptjs";
import { db } from "../utils/db.server";
import { ACCESS_TOKEN_EXPIRATION } from "../constants";
import * as TokenService from "./token";
import * as TokenUtils from "../utils/token";

interface IUserSignup extends IRequest {
  username: string;
  password: string;
}

interface IRefresh extends IRequest {
  currentRefreshToken: string;
}

interface IPayload {
  id: number;
  role: string;
  username: string;
}

export const signup = async (user: IUserSignup) => {
  const { username, password, fingerprint } = user;

  const userExists = await db.user.findUnique({ where: { username } });
  if (userExists) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const { id } = await db.user.create({
    data: {
      username,
      password_hash: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      password_hash: true,
    },
  });

  const payload = { id, username, hashedPassword };

  const accessToken = await TokenUtils.generateAccessToken(payload);
  const refreshToken = await TokenUtils.generateRefreshToken(payload);

  await TokenService.createRefreshSession({ id, refreshToken, fingerprint });

  return { accessToken, refreshToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION };
};

export const login = async (user: IUserSignup) => {
  const { username, password, fingerprint } = user;

  const userFound = await db.user.findUnique({ where: { username } });
  if (!userFound) throw new Error("User not found");

  const isPasswordValid = await bcrypt.compare(password, userFound.password_hash);
  if (!isPasswordValid) throw new Error("Invalid username or password");

  const payload: IPayload = { id: userFound.id, role: userFound.role, username: userFound.username };

  const accessToken = await TokenUtils.generateAccessToken(payload);
  const refreshToken = await TokenUtils.generateRefreshToken(payload);

  await TokenService.createRefreshSession({ id: userFound.id, refreshToken, fingerprint });
  return { accessToken, refreshToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION };
};

export const logout = async (refreshToken: string) => {
  await TokenService.deleteRefreshSession(refreshToken);
};

export const refresh = async ({ currentRefreshToken, fingerprint }: IRefresh) => {
  if (!currentRefreshToken) {
    throw new Error("unauthorized");
  }

  const refreshSession = await TokenService.getRefreshSession(currentRefreshToken);

  if (!refreshSession) {
    throw new Error("unauthorized");
  }

  if (refreshSession.fingerprint !== fingerprint?.hash) {
    throw new Error("forbidden");
  }

  await TokenService.deleteRefreshSession(currentRefreshToken);

  let payload: IPayload;
  try {
    payload = await TokenService.verifyRefreshToken(currentRefreshToken) as IPayload;
  } catch (error) {
    throw new Error("forbidden");
  }

  const user = await db.user.findUnique({
    where: {
      username: payload.username,
    },
  });

  if (!user) {
    throw new Error("unauthorized");
  }

  const actualPayload = { id: user.id, username: user.username, role: user.role };

  const accessToken = await TokenUtils.generateAccessToken(actualPayload);
  const refreshToken = await TokenUtils.generateRefreshToken(actualPayload);

  await TokenService.createRefreshSession({ id: user.id, refreshToken, fingerprint });
  return { accessToken, refreshToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION };
};
