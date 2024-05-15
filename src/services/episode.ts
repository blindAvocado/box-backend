import { Prisma } from "@prisma/client";
import { ICommentDTO, IEpisodeDTO, IOtherEpisode } from "../types/episode";
import { db } from "../utils/db.server";
import { InternalError, NotFound } from "../utils/errors";
import { normalizeImagePath } from "../utils/base";
import { ICreateCommentInput } from "../types/inputs";
import { IAction, ITokenPayload } from "../types/base";
import * as UserService from "./user";

const showWithFields = Prisma.validator<Prisma.ShowDefaultArgs>()({
  include: {
    episodes: true,
  },
});

const comment = Prisma.validator<Prisma.CommentDefaultArgs>()({
  include: {
    user: true,
    subcomments: {
      include: {
        user: true,
        subcomments: {
          include: {
            user: true,
            subcomments: {
              include: {
                user: true,
                subcomments: true,
              }
            }
          }
        },
      }
    },
  },
});

type Show = Prisma.ShowGetPayload<typeof showWithFields>;

type Comment = Prisma.CommentGetPayload<typeof comment>;

export const getEpisodePage = async (episodeId: number) => {
  console.log("🚀 ~ getEpisodePage ~ episodeId:", episodeId)
  try {
    const episode = await db.episode.findUnique({
      where: { id: episodeId },
      include: {
        show: {
          include: {
            episodes: true,
          },
        },
        comments: {
          include: {
            user: true,
            subcomments: {
              include: {
                user: true,
                subcomments: {
                  include: {
                    user: true,
                    subcomments: {
                      include: {
                        user: true,
                        subcomments: true,
                      }
                    }
                  }
                },
              }
            },
          },
        },
      },
    });

    console.log("🚀 ~ getEpisodePage ~ episode:", episode);


    if (!episode) {
      return new NotFound();
    }

    const episodeDTO: IEpisodeDTO = {
      id: episode.id,
      episodeNumber: episode.number,
      seasonNumber: episode.season_number ?? 0,
      name: episode.title,
      ...(episode.summary && { overview: episode.summary }),
      airdate: episode.date_aired,
      runtime: episode.runtime,
      showId: episode.show_id,
      showName: episode.show.title,
      ...(episode.thumb_url && { stillPath: normalizeImagePath(episode.thumb_url) }),
      rating: {
        average: episode.average_rating,
        votes: episode.votes_count,
      },
      watched: 0,
      comments_count: 0,
      otherEpisodes: getOtherEpisodes(episode.show.episodes, episodeId),
      comments: episode.comments.map(comment => normalizeComments(comment as Comment)),
    };

    return episodeDTO;
  } catch (err) {
    console.log("🚀 ~ getEpisodePage ~ err:", err)
    throw new InternalError();
  }
};

export const getEpisodeComments = async (episodeId: number) => {
  try {
    const episode = await db.episode.findUnique({
      where: { id: episodeId },
      include: {
        comments: {
          include: {
            user: true,
            subcomments: true,
          },
        },
      },
    });

    if (!episode) {
      return new NotFound();
    }

    const commentsDTO: ICommentDTO[] = [];

    for (const comment of episode.comments) {
      commentsDTO.push(normalizeComments(comment as Comment));
    }

    return commentsDTO;
  } catch (err) {
    return new NotFound();
  }
};

export const createEpisodeComment = async (episodeId: number, comment: ICreateCommentInput, user: ITokenPayload): Promise<ICommentDTO> => {
  try {
    const newComment = await db.comment.create({
      data: {
        user: { connect: { id: user.id } },
        episode: { connect: { id: episodeId } },
        body: comment.body,
        ...(comment.parentCommentId && { parent_comment: { connect: { id: comment.parentCommentId } } }),
        ...(comment.attachedImageUrl && { attached_image_url: comment.attachedImageUrl }),
      },
      include: {
        user: true,
        parent_comment: true,
      }
    });

    await UserService.createAction(user.id, "COMMENT", {
      value: newComment.id,
      target: {
        type: "episode",
        id: episodeId,
      }
    });

    return {
      id: newComment.id,
      createdAt: newComment.createdAt,
      body: {
        text: newComment.body,
        ...(newComment.attached_image_url && { image: normalizeImagePath(newComment.attached_image_url) }),
      },
      owner: {
        id: newComment.user.id,
        username: newComment.user.username,
      }
    };
  } catch (err) {
    console.log("🚀 ~ createEpisodeComment ~ err:", err);
    throw new InternalError();
  }
};

const getOtherEpisodes = (episodes: Show["episodes"], currentEpisodeId: number): IOtherEpisode[] => {
  const episodesRev = episodes.reverse();

  if (episodes.length <= 7) {
    const res: IOtherEpisode[] = [];

    for (const episode of episodesRev) {
      res.push({
        id: episode.id,
        episodeNumber: episode.number,
        seasonNumber: episode.season_number ?? 0,
        name: episode.title,
      });
    }

    return res;
  }

  const currentEpisodeIndex = episodesRev.findIndex((episode) => episode.id === currentEpisodeId);

  const resultLength = 7;
  const halfLength = Math.floor(resultLength / 2);
  const startIndex = Math.max(0, currentEpisodeIndex - halfLength);
  const endIndex = startIndex + resultLength - 1;

  console.log("🚀 ~ getOtherEpisodes ~ currentEpisodeIndex:", currentEpisodeIndex);
  console.log("🚀 ~ getOtherEpisodes ~ startIndex:", startIndex);
  console.log("🚀 ~ getOtherEpisodes ~ endIndex:", endIndex);

  const filteredList = episodesRev.slice(startIndex, endIndex + 1);

  const res: IOtherEpisode[] = [];

  for (const episode of filteredList) {
    res.push({
      id: episode.id,
      episodeNumber: episode.number,
      seasonNumber: episode.season_number ?? 0,
      name: episode.title,
    });
  }

  return res;
};

const normalizeComments = (comment: Comment): ICommentDTO => {
  return {
    id: comment.id,
    createdAt: comment.createdAt,
    body: {
      text: comment.body,
      ...(comment.attached_image_url && { image: normalizeImagePath(comment.attached_image_url) }),
    },
    owner: {
      id: comment.user?.id,
      username: comment.user?.username,
    },
    ...(comment.subcomments.length && {
      subcomments: comment.subcomments.map((subcomment) => normalizeComments(subcomment as Comment)),
    }),
  };
};
