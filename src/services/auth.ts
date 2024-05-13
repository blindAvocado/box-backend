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

  const payload = { id: userFound.id, role: userFound.role, username: userFound.username };

  const accessToken = await TokenUtils.generateAccessToken(payload);
  const refreshToken = await TokenUtils.generateRefreshToken(payload);

  await TokenService.createRefreshSession({ id: userFound.id, refreshToken, fingerprint });
  return { accessToken, refreshToken, accessTokenExpiration: ACCESS_TOKEN_EXPIRATION };
};

export const logout = async (refreshToken: string) => {
  await TokenService.deleteRefreshSession(refreshToken);
};

export const refresh = async ({ currentRefreshToken, fingerprint }: IRefresh) => {};
