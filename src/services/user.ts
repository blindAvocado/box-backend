import { Prisma } from "@prisma/client";
import { IAction, IActionType } from "../types/base";
import { db } from "../utils/db.server";
import { InternalError, NotFound } from "../utils/errors";
import { IFollowInput, ILikeInput, IRateInput, IWatchInput } from "../types/inputs";
import { normalizeImagePath } from "../utils/base";
import { IShowUser } from "../types/show";

const action = Prisma.validator<Prisma.ActionDefaultArgs>()({});

type Action = Prisma.ActionGetPayload<typeof action>;

export const createAction = async (userId: number, eventType: IActionType, data: IAction) => {
  try {
    const action = await db.action.create({
      data: {
        user: { connect: { id: userId } },
        action_type: eventType as Action["action_type"],
        action_data: data as object,
      },
    });
  } catch (err) {
    console.log("🚀 ~ createAction ~ err:", err);
    return new InternalError();
  }
};

export const getUserActions = async (userId: number, days: number = 30) => {
  try {
    const now = new Date();
    const dateLimit = new Date(now.getTime() - days * 24 * 60 * 60 * 1000); // 30 days

    const actions = await db.action.findMany({
      where: {
        user_id: userId,
        createdAt: {
          gte: dateLimit,
        },
      },
    });

    console.log("🚀 ~ getUserActions ~ actions:", actions);

    return actions;
  } catch (err) {
    console.log("🚀 ~ getUserActions ~ err:", err);
    throw new NotFound();
  }
};

export const rate = async (userId: number, input: IRateInput) => {
  try {
    let ratingRecord;

    if (input.type === "show") {
      let isRatingEqual = false;

      const existingRating = await db.showRating.findUnique({
        where: {
          user_id_show_id: {
            user_id: userId,
            show_id: input.id,
          },
        },
      });

      if (input.value === 0) {
        if (existingRating) {
          await db.showRating.delete({
            where: {
              user_id_show_id: {
                user_id: userId,
                show_id: input.id,
              },
            },
          });
        }

        return existingRating;
      }

      if (!existingRating && input.value !== 0) {
        ratingRecord = await db.showRating.create({
          data: {
            user: { connect: { id: userId } },
            show: { connect: { id: input.id } },
            rating: input.value,
          },
        });
      } else if (existingRating) {
        if (parseFloat(existingRating.rating as unknown as string) === input.value) {
          isRatingEqual = true;
        } else {
          ratingRecord = await db.showRating.update({
            where: {
              user_id_show_id: {
                user_id: userId,
                show_id: input.id,
              },
            },
            data: {
              rating: input.value,
            },
          });
        }
      }

      if (!isRatingEqual && input.value !== 0) {
        await createAction(userId, "RATE", {
          value: input.value,
          target: {
            type: "show",
            id: input.id,
          },
        });
      }

      const ratings = await db.showRating.findMany({
        where: {
          show_id: input.id,
        },
      });

      const totalRating = ratings.reduce((acc, cur) => acc + parseFloat(cur.rating as unknown as string), 0);
      const votesCount = ratings.length ?? 1;

      const updatedShow = await db.show.update({
        where: {
          id: input.id,
        },
        data: {
          average_rating: totalRating / votesCount,
          votes_count: votesCount,
        },
      });
    } else if (input.type === "episode") {
      let wasCreated = false;

      const existingRating = await db.episodeRating.findUnique({
        where: {
          user_id_episode_id: {
            user_id: userId,
            episode_id: input.id,
          },
        },
      });

      const hasWatched = await db.watchedEpisode.findUnique({
        where: {
          user_id_episode_id: {
            user_id: userId,
            episode_id: input.id,
          },
        },
      });

      if (!hasWatched) {
        await db.watchedEpisode.create({
          data: {
            user_id: userId,
            episode_id: input.id,
          },
        });

        wasCreated = true;
      }

      if (input.value === 0) {
        if (existingRating) {
          await db.episodeRating.delete({
            where: {
              user_id_episode_id: {
                user_id: userId,
                episode_id: input.id,
              },
            },
          });
        }

        return existingRating;
      }

      if (!existingRating) {
        ratingRecord = await db.episodeRating.create({
          data: {
            user: { connect: { id: userId } },
            episode: { connect: { id: input.id } },
            rating: input.value,
          },
        });
      } else {
        ratingRecord = await db.episodeRating.update({
          where: {
            user_id_episode_id: {
              user_id: userId,
              episode_id: input.id,
            },
          },
          data: {
            rating: input.value,
          },
        });
      }

      await createAction(userId, wasCreated ? "RATE_WATCH" : "RATE", {
        value: input.value,
        target: {
          type: "episode",
          id: input.id,
        },
      });

      const ratings = await db.episodeRating.findMany({
        where: {
          episode_id: input.id,
        },
      });

      const totalRating = ratings.reduce((acc, cur) => parseFloat(cur.rating as unknown as string), 0);
      const votesCount = ratings.length;

      await db.episode.update({
        where: {
          id: input.id,
        },
        data: {
          average_rating: totalRating / votesCount,
          votes_count: votesCount,
        },
      });
    } else {
      throw new InternalError("Invalid type");
    }

    return ratingRecord;
  } catch (err) {
    console.log("🚀 ~ rate ~ err:", err);
    return new InternalError();
  }
};

export const watch = async (userId: number, input: IWatchInput) => {
  try {
    if (input.value) {
      const watch = await db.watchedEpisode.create({
        data: {
          user: { connect: { id: userId } },
          episode: { connect: { id: input.id } },
        },
      });

      console.log("🚀 ~ watch ~ watch:", watch);

      await createAction(userId, "WATCH", {
        target: {
          type: "episode",
          id: input.id,
        },
      });

      return watch;
    } else {
      const watch = await db.watchedEpisode.delete({
        where: {
          user_id_episode_id: {
            user_id: userId,
            episode_id: input.id,
          },
        },
      });

      return watch;
    }
  } catch (err) {
    throw new InternalError();
  }
};

export const like = async (userId: number, input: ILikeInput) => {
  try {
    let res;
    switch (input.type) {
      case "episode":
        res = await _likeEpisode(userId, input);

        // await createAction(userId, "LIKE", {
        //   value: true,
        //   target: {
        //     type: "episode",
        //     id: input.id,
        //   },
        // });

        break;

      case "show":
        res = await _likeShow(userId, input);

        // await createAction(userId, "LIKE", {
        //   value: true,
        //   target: {
        //     type: "show",
        //     id: input.id,
        //   },
        // });

        break;

      case "season":
        res = await _likeSeason(userId, input);

        // await createAction(userId, "LIKE", {
        //   value: true,
        //   target: {
        //     type: "season",
        //     id: input.id,
        //   },
        // });

        break;

      default:
        throw new InternalError();
    }

    console.log("🚀 ~ like ~ res:", res);
    return res;
  } catch (err) {
    throw new InternalError();
  }
};

export const follow = async (userId: number, input: IFollowInput) => {
  try {
    const result = await db.follows.create({
      data: {
        follower: { connect: { id: userId } },
        following: { connect: { id: input.id } },
      },
    });

    if (result) {
      await createAction(userId, "FOLLOW", {
        value: userId,
        target: {
          type: "user",
          id: input.id,
        },
      });
    }

    return result;
  } catch (err) {
    throw new InternalError();
  }
};

export const unfollow = async (userId: number, input: IFollowInput) => {
  try {
    const result = await db.follows.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: input.id,
        },
      },
    });

    if (result) {
      await createAction(userId, "UNFOLLOW", {
        value: userId,
        target: {
          type: "user",
          id: input.id,
        },
      });
    }

    return result;
  } catch (err) {
    throw new InternalError();
  }
};

export const getPage = async (userId: number) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        watched_shows: {
          include: {
            show: true,
          },
        },
        show_ratings: {
          include: {
            show: true,
          },
        },
        followers: {
          include: {
            follower: true,
          },
        },
        following: {
          include: {
            following: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFound();
    }

    const userDTO = {
      id: user.id,
      username: user.username,
      ...(user.avatar_url && { avatar: normalizeImagePath(user.avatar_url) }),
      followers: user.followers,
      following: user.following,
    };

    const _watchedEpisodes = await db.watchedEpisode.findMany({
      where: {
        user_id: userId,
      },
      include: {
        episode: {
          include: {
            show: true,
          },
        },
      },
    });

    const wasted = {
      watchedEpisodes: 0,
      totalEpisodes: 0,
      watchedHours: 0,
      totalHours: 0,
      watchedDays: 0,
      totalDays: 0,
    };

    wasted.watchedEpisodes = _watchedEpisodes.length;
    wasted.watchedHours = Math.ceil((_watchedEpisodes.length * 50) / 60); // TODO

    const watchedShows: Record<string, IShowUser[]> = {
      watching: [],
      going_to: [],
      stopped: [],
      watchedAll: [],
    };

    for (const ws of user?.watched_shows) {
      let property: "going_to" | "stopped" | "watching" | "watchedAll" = "watching";

      if (ws.status === "GOING_TO") {
        property = "going_to";
      }

      if (ws.status === "STOPPED") {
        property = "stopped";
      }

      if (ws.status === "WATCHING") {
        property = "watching";
      }

      if (ws.status === "WATCHED_ALL") {
        property = "watchedAll";
      }

      const rating: number = parseFloat(
        user.show_ratings.find((sr) => sr.show_id === ws.show_id)?.rating as unknown as string
      );

      watchedShows[property].push({
        id: ws.show_id,
        title: ws.show.title,
        airStatus: ws.show.air_status,
        rating: rating ?? 0,
        watchedEpisodes: _watchedEpisodes.filter((we) => we.episode.show_id === ws.show_id).length,
        totalEpisodes: ws.show.episode_count,
        ...(ws.show.thumb_url && { bannerPath: normalizeImagePath(ws.show.thumb_url) }),
      });

      wasted.totalEpisodes += ws.show.episode_count;
      wasted.totalHours += Math.floor((ws.show.episode_count * (ws.show.average_runtime ?? 40)) / 60);
    }

    wasted.totalDays = Math.ceil(wasted.totalHours / 60);
    wasted.watchedDays = Math.floor(wasted.watchedHours / 60);

    const _rawActivity = await getUserActions(userId);

    return {
      user: userDTO,
      watchedShows,
      wasted,
      rawActivity: _rawActivity,
      stats: {
        episodesThisYear: 325,
        lists: 5,
        following: 0,
        followed: 0,
      },
      ratings: {
        "1": 0,
        "2": 2,
        "3": 9,
        "4": 17,
        "5": 5,
        "4.5": 8,
        "3.5": 26,
        "2.5": 4,
        "1.5": 0,
        "0.5": 0,
      },
      heatmap: [
        {
          date: "2023-9-22",
          count: 7,
        },
        {
          date: "2023-9-23",
          count: 2,
        },
        {
          date: "2023-9-27",
          count: 1,
        },
        {
          date: "2023-9-29",
          count: 4,
        },
      ],
      following: [
        {
          id: 1,
          username: "chantines",
        },
        {
          id: 2,
          username: "bond",
          avatar:
            "https://preview.redd.it/odd-question-was-bane-sexually-abused-by-cia-i-heard-that-v0-7qmjvvhyk7wc1.jpg?width=640&crop=smart&auto=webp&s=2192aff1d789f7207231556fb004876955b809c7",
        },
        {
          id: 3,
          username: "deadmaun",
        },
        {
          id: 4,
          username: "DrBeybutyan",
        },
        {
          id: 5,
          username: "magicflex",
        },
        {
          id: 6,
          username: "BringingItAllBackHome",
        },
      ],
      activity: [
        {
          date: "2023-06-09T00:00:00.000Z",
          watchedRuntime: 130,
          items: [
            {
              event: "rated",
              value: 4.5,
              date: "2023-06-09T03:16:00.000Z",
              target: {
                type: "episode",
                id: 2357,
                season: 1,
                episode: 1,
                show: {
                  id: 4378,
                  name: "Stargate SG-1",
                },
              },
            },
            {
              event: "watched",
              date: "2023-06-09T03:46:00.000Z",
              target: {
                type: "episode",
                id: 2358,
                season: 1,
                episode: 2,
                show: {
                  id: 4378,
                  name: "Stargate SG-1",
                },
              },
            },
            {
              event: "status",
              value: "WATCHING",
              date: "2023-06-09T03:58:00.000Z",
              target: {
                type: "show",
                id: 4378,
                name: "Stargate SG-1",
              },
            },
            {
              event: "status",
              value: "GOING_TO",
              date: "2023-06-09T07:26:00.000Z",
              target: {
                type: "show",
                id: 4379,
                name: "Stargate Atlantis",
              },
            },
            {
              event: "comment",
              value: 73254,
              date: "2023-06-09T07:55:00.000Z",
              target: {
                type: "episode",
                id: 2358,
                season: 1,
                episode: 2,
                show: {
                  id: 4378,
                  name: "Stargate SG-1",
                },
              },
            },
          ],
        },
      ],
    };
  } catch (err) {
    console.log("🚀 ~ getPage ~ err:", err);
    throw new InternalError();
  }
};

const _likeShow = async (userId: number, input: ILikeInput) => {};

const _likeSeason = async (userId: number, input: ILikeInput) => {};

const _likeEpisode = async (userId: number, input: ILikeInput) => {};
