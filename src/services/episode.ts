import { Prisma } from "@prisma/client";
import { ICommentDTO, IEpisodeDTO, IOtherEpisode } from "../types/episode";
import { db } from "../utils/db.server";
import { NotFound } from "../utils/errors";
import { normalizeImagePath } from "../utils/base";
import { ArrayElement } from "../types/base";

const showWithFields = Prisma.validator<Prisma.ShowDefaultArgs>()({
  include: {
    episodes: true,
  },
});

const episodeWithFields = Prisma.validator<Prisma.EpisodeDefaultArgs>()({
  include: {
    comments: {
      include: {
        user: true,
        subcomments: true,
      }
    },
  },
});

const comment = Prisma.validator<Prisma.CommentDefaultArgs>()({
  include: {
    user: true,
    subcomments: true,
  }
})

type Show = Prisma.ShowGetPayload<typeof showWithFields>;

type Episode = Prisma.EpisodeGetPayload<typeof episodeWithFields>;

type Comment = Prisma.CommentGetPayload<typeof comment>

export const getEpisodePage = async (episodeId: number) => {
  try {
    const episode = await db.episode.findUnique({
      where: { id: episodeId },
      include: {
        show: {
          include: {
            episodes: true,
          },
        },
        comments: true,
      },
    });

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
    };

    return episodeDTO;
  } catch (err) {
    return new NotFound();
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
      commentsDTO.push(normalizeComments(comment));
    }

    return commentsDTO;
  } catch (err) {
    return new NotFound();
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
      id: comment.user.id,
      username: comment.user.username,
    },
    ...(comment.subcomments.length && { subcomments: comment.subcomments.map(subcomment => normalizeComments(subcomment as Comment)) }),
  };
};
