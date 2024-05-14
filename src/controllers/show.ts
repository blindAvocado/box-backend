import { Request, Response } from "express";
import ErrorUtils from "../utils/errors";
import * as ShowService from "../services/show";

export const getAllShows = async (req: Request, res: Response) => {};

export const getPage = async (req: Request, res: Response) => {
  const showId: string = req.params.show_id;

  try {
    const show = await ShowService.getShowPage(parseInt(showId, 10));

    res.status(200).json({ show });
  } catch (err: any) {
    return ErrorUtils.catchError(res, err);
  }
};

export const changeStatus = async (req: Request, res: Response) => {};
