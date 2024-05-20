import { Request, Response } from "express";
import ErrorUtils from "../utils/errors";
import * as ShowService from "../services/show";
import { ITokenPayload } from "../types/base";
import { TStatusInput } from "../types/inputs";

export const getAllShows = async (req: Request, res: Response) => {
  try {
    const show = await ShowService.getAllShows();

    res.status(200).json({ show });
  } catch (err: any) {
    return ErrorUtils.catchError(res, err);
  }
};

export const getPage = async (req: Request, res: Response) => {
  const showId: string = req.params.show_id;

  //@ts-ignore
  const user = req.user as ITokenPayload;

  try {
    const show = await ShowService.getShowPage(parseInt(showId, 10), (user?.id ?? null));

    res.status(200).json({ show });
  } catch (err: any) {
    return ErrorUtils.catchError(res, err);
  }
};

export const changeStatus = async (req: Request, res: Response) => {
  const showId: string = req.params.show_id;
  const { status }: { status: TStatusInput } = req.body;

  //@ts-ignore
  const user = req.user as ITokenPayload;

  try {
    const changedStatus = await ShowService.changeStatus(parseInt(showId, 10), user.id, status);

    res.status(200).json({ status });
  } catch (err: any) {
    return ErrorUtils.catchError(res, err);
  }
};
