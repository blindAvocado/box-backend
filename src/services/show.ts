import { Prisma } from "@prisma/client";
import { EAirStatus } from "../types/show";
import type { IActor, IBestEpisode, IEpisode, ISeason, IShowDTO, TAirStatus } from "../types/show";
import { db } from "../utils/db.server";
import { NotFound } from "../utils/errors";
import { ArrayElement } from "../types/base";
import { normalizeImagePath } from "../utils/base";


const showWithFields = Prisma.validator<Prisma.ShowDefaultArgs>()({
  include: {
    episodes: {
      include: {
        comments: true,
      },
    },
    seasons: true,
    actors: true,
  },
});

type Show = Prisma.ShowGetPayload<typeof showWithFields>;

export const getShowPage = async (showId: number) => {
  try {
    const show = await db.show.findUnique({
      where: { id: showId },
      include: {
        actors: true,
        network: true,
        genres: true,
        seasons: true,
        episodes: {
          include: {
            comments: true,
          },
        },
        country: true,
        // users_watched_arr: {
        //   select: {
        //     user: {
        //       select: {
        //         _count: true,
        //       }
        //     }
        //   }  
        // },
        users_favorite: {
          include: {
            user: {
              select: {
                _count: true,
              }
            }
          }
        }
      },
    });

    if (!show) {
      return new NotFound();
    }

    const showDTO: IShowDTO = {
      id: show.id,
      title: show.title,
      posterPath: normalizeImagePath(show.poster_url),
      ...(show.summary && { overview: show.summary }),
      ...(show.tagline && { tagline: show.tagline }),
      ...(show.thumb_url && { backdropPath: normalizeImagePath(show.thumb_url) }),
      properties: {
        ...(show.date_started && { dateStarted: show.date_started }),
        ...(show.date_ended && { dateEnded: show.date_ended }),
        airStatus: normalizeAirStatus(show.air_status as EAirStatus),
        countries: [show.country.code],
        network: { id: show.network.id, name: show.network.name },
        genres: show.genres,
        episodes: show.episodes.length,
        seasons: show.seasons.length,
        totalRuntime: getTotalRuntime(show.episodes, show.average_runtime),
      },
      community: {
        watching: show.users_watched,
        lists: 0,
        favorite: show.users_favorite.length,
        rating: {
          average: show.average_rating ?? "0",
          votes: show.votes_count,
        }
      },
      bestEpisodes: getBestEpisodes(show.episodes),
      ...(show.actors && { actors: show.actors.map(actor => normalizeActor(actor)) }),
      episodes: show.episodes.map(episode => normalizeEpisode(episode)),
      seasons: show.seasons.map(season => normalizeSeason(season))
    };

    return showDTO;
  } catch (err: any) {
    return new NotFound();
  }
};

const normalizeAirStatus = (status: EAirStatus): TAirStatus => {
  switch (status) {
    case EAirStatus.ON_AIR:
      return "AIRING";
    case EAirStatus.ENDED:
      return "DEAD";
    case EAirStatus.PAUSED:
      return "PAUSED";
    default:
      return "DEAD";
  }
};

const getTotalRuntime = (episodes: Show["episodes"], averageRuntime: number | null = 0) => {
  if (averageRuntime) {
    return episodes.length * averageRuntime;
  }

  let totalRuntime = 0;
  for (const episode of episodes) {
    totalRuntime += episode.runtime;
  }

  return totalRuntime;
};

const normalizeEpisode = (episode: ArrayElement<Show["episodes"]>): IEpisode => {
  return {
    id: episode.id,
    episodeNumber: episode.number,
    seasonNumber: episode.season_number ?? 0,
    name: episode.title,
    showId: episode.show_id,
    rating: {
      average: episode.average_rating,
      votes: episode.votes_count ?? 0,
    },
    ...(episode.comments && { comments: episode.comments.length }),
    runtime: episode.runtime ?? 0,
    airdate: episode.date_aired,
  };
};

const normalizeSeason = (season: ArrayElement<Show["seasons"]>): ISeason => {
  return {
    id: season.id,
    number: season.number,
    episodes: season.episode_count,
    rating: season.average_rating,
    ...(season.date_started && { airdate: season.date_started }),
    ...(season.poster_url && { posterPath: normalizeImagePath(season.poster_url) }),
  }
}

const normalizeActor = (actor: ArrayElement<Show["actors"]>): IActor => {
  return {
    id: actor.id,
    name: actor.name,
    ...(actor.profile_url && { profilePath: normalizeImagePath(actor.profile_url) }),
  }
}

const getBestEpisodes = (episodes: Show["episodes"]): IBestEpisode[] => {
  const res: IBestEpisode[] = [];

  const sortedEpisodes = episodes.slice(0, 5).sort((a, b) => parseFloat(b.average_rating as unknown as string) - parseFloat(a.average_rating as unknown as string))

  for (const episode of sortedEpisodes) {
    res.push({
      id: episode.id,
      episodeNumber: episode.number,
      seasonNumber: episode.season_number ?? 0,
      title: episode.title,
      rating: episode.average_rating ?? "0",
    })
  }

  return res;
}