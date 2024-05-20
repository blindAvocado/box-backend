import { Request, Response } from "express";
import ErrorUtils from "../utils/errors";
import * as EpisodeService from "../services/episode";
import { ICreateCommentInput } from "../types/inputs";
import { ITokenPayload } from "../types/base";

export const getPage = async (req: Request, res: Response) => {
  const episodeId: string = req.params.episode_id;

  //@ts-ignore
  const user = req.user as ITokenPayload;

  try {
    const episode = await EpisodeService.getEpisodePage(parseInt(episodeId, 10), (user?.id ?? null));

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

export const createEpisodeComment = async (req: Request, res: Response) => {
  const episodeId: string = req.params.episode_id;
  const commentBody: ICreateCommentInput = req.body;

  //@ts-ignore
  const user = req.user as ITokenPayload;

  console.log("🚀 ~ createEpisodeComment ~ user:", user);
  
  try {
    const comment = await EpisodeService.createEpisodeComment(parseInt(episodeId, 10), commentBody, user);

    res.status(200).json(comment);
  } catch (err: any) {
    console.log("🚀 ~ createEpisodeComment ~ err:", err)
    return ErrorUtils.catchError(res, err);
  }
}