import type { ICreateListInput, IFollowInput, ILikeInput, IRateInput, IWatchInput } from "../types/inputs";
import type { ITokenPayload } from "../types/base";
import { Request, Response } from "express";
import ErrorUtils from "../utils/errors";
import * as UserService from "../services/user";

export const rate = async (req: Request, res: Response) => {
  const payload: IRateInput = req.body;

  //@ts-ignore
  const user = req.user as ITokenPayload;

  try {
    const rating = await UserService.rate(user.id, payload);

    res.status(200).json(rating);
  } catch (err) {
    console.log("🚀 ~ rate ~ err:", err);
    return ErrorUtils.catchError(res, err);
  }
};

export const like = async (req: Request, res: Response) => {
  const payload: ILikeInput = req.body;

  //@ts-ignore
  const user = req.user as ITokenPayload;

  try {
    const watched = await UserService.like(user.id, payload);

    res.status(200).json(watched);
  } catch (err) {
    console.log("🚀 ~ like ~ err:", err);
    return ErrorUtils.catchError(res, err);
  }
};

export const watch = async (req: Request, res: Response) => {
  const payload: IWatchInput = req.body;

  //@ts-ignore
  const user = req.user as ITokenPayload;

  try {
    const watched = await UserService.watch(user.id, payload);

    res.status(200).json(watched);
  } catch (err) {
    console.log("🚀 ~ watch ~ err:", err);
    return ErrorUtils.catchError(res, err);
  }
};

export const follow = async (req: Request, res: Response) => {
  const payload: IFollowInput = req.body;

  //@ts-ignore
  const user = req.user as ITokenPayload;

  try {
    const result = await UserService.follow(user.id, payload);

    res.status(200).json(result);
  } catch (err) {
    console.log("🚀 ~ follow ~ err:", err);
    return ErrorUtils.catchError(res, err);
  }
};

export const unfollow = async (req: Request, res: Response) => {
  const payload: IFollowInput = req.body;

  //@ts-ignore
  const user = req.user as ITokenPayload;

  try {
    const result = await UserService.unfollow(user.id, payload);

    res.status(200).json(result);
  } catch (err) {
    console.log("🚀 ~ unfollow ~ err:", err);
    return ErrorUtils.catchError(res, err);
  }
};

export const getWatchedShows = async (req: Request, res: Response) => {};

export const getPage = async (req: Request, res: Response) => {
  const userId = req.params.user_id;

  try {
    const page = await UserService.getPage(parseInt(userId, 10));

    res.status(200).json(page);
  } catch (err) {
    console.log("🚀 ~ rate ~ err:", err);
    return ErrorUtils.catchError(res, err);
  }
};

export const createList = async (req: Request, res: Response) => {
  const payload: ICreateListInput = req.body;

  //@ts-ignore
  const user = req.user as ITokenPayload;

  try {
    const list = await UserService.createList(user.id, payload);
    res.status(200).json(list);
  } catch (err) {
    console.log("🚀 ~ createList ~ err:", err);
    return ErrorUtils.catchError(res, err);
  }
};

export const updateList = async (req: Request, res: Response) => {
  const userId = req.params.user_id;

  try {
    const list = await UserService.updateList(parseInt(userId, 10));
    res.status(200).json(list);
  } catch (err) {
    console.log("🚀 ~ updateList ~ err:", err);
    return ErrorUtils.catchError(res, err);
  }
};

export const deleteList = async (req: Request, res: Response) => {
  const userId = req.params.user_id;

  try {
    const list = await UserService.deleteList(parseInt(userId, 10));
    res.status(200).json(list);
  } catch (err) {
    console.log("🚀 ~ updateList ~ err:", err);
    return ErrorUtils.catchError(res, err);
  }
};
