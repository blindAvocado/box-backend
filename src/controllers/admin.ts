import { Request, Response } from "express";
import * as AdminService from "../services/admin";
import ErrorUtils from "../utils/errors";

export async function addShowFromTMDB(req: Request, res: Response) {
  const tmdbId: string = req.params.tmdb;
  const includeTmdbRatings: boolean = req.query.tmdb === "true" ? true : false;

  try {
    const show = await AdminService.addShowFromTMDB(tmdbId, includeTmdbRatings);

    res.status(200).json({ show });
  } catch (err) {
    return ErrorUtils.catchError(res, err);
  }
}