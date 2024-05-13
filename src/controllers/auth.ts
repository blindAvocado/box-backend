import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../utils/db.server";
import * as AuthService from "../services/auth";
import { COOKIE_SETTINGS } from "../constants";

export const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const { fingerprint } = req;

  try {
    const { accessToken, refreshToken, accessTokenExpiration } = await AuthService.signup({
      username,
      password,
      fingerprint,
    });

    res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);

    return res.status(200).json({ accessToken, accessTokenExpiration });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const { fingerprint } = req;

  try {
    const { accessToken, refreshToken, accessTokenExpiration } = await AuthService.login({
      username,
      password,
      fingerprint,
    });

    res.cookie("refreshToken", refreshToken, COOKIE_SETTINGS.REFRESH_TOKEN);

    return res.status(200).json({ accessToken, accessTokenExpiration });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const { fingerprint } = req;

  try {
    await AuthService.logout(refreshToken);

    res.clearCookie("refreshToken");

    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const refresh = async (req: Request, res: Response) => {};
