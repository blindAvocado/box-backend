import { Request, Response } from "express";
import ErrorUtils from "../utils/errors";
import * as EpisodeService from "../services/episode";

export const getPage = async (req: Request, res: Response) => {
  const episodeId: string = req.params.episode_id;

  try {
    const episode = await EpisodeService.getEpisodePage(parseInt(episodeId, 10));

    res.status(200).json(episode);
  } catch (err: any) {
    return ErrorUtils.catchError(res, err);
  }
};

export const getEpisodeComments = async (req: Request, res: Response) => {
  const episodeId: string = req.params.episode_id;

  try {
    const comments = await EpisodeService.getEpisodeComments(parseInt(episodeId, 10));

    res.status(200).json(comments);
  } catch (err: any) {
    return ErrorUtils.catchError(res, err);
  }
}