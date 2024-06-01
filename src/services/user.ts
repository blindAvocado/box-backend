import type { IAction, IActionType } from "../types/base";
import type { ICreateListInput, IFollowInput, ILikeInput, IRateInput, IWatchInput } from "../types/inputs";
import type { IShowUser } from "../types/show";

import { ListItem, ListType, Prisma } from "@prisma/client";
import { db } from "../utils/db.server";
import { InternalError, NotFound } from "../utils/errors";
import { normalizeImagePath } from "../utils/base";

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

    for (const action of actions) {
      const data = action.action_data as object as IAction;
      if (data?.target.type === "episode") {
        const episode = await db.episode.findUnique({
          where: {
            id: data.target.id,
          },
          include: {
            show: true,
          },
        });

        if (episode) {
          data.target.customData = {
            show: {
              id: episode.show.id,
              title: episode.show.title,
            },
          };
        }
      }

      if (data?.target.type === "show") {
        const show = await db.show.findUnique({
          where: {
            id: data.target.id,
          },
        });

        if (show) {
          data.target.customData = {
            show: {
              title: show.title,
            },
          };
        }
      }

      if (data?.target.type === "user") {
        const user = await db.user.findUnique({
          where: {
            id: data.target.id,
          },
        });

        if (user) {
          data.target.customData = {
            user: {
              id: user.id,
              name: user.username,
            },
          };
        }
      }
    }

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
            follower: {
              select: {
                id: true,
                username: true,
                avatar_url: true,
              },
            },
          },
        },
        following: {
          include: {
            following: {
              select: {
                id: true,
                username: true,
                avatar_url: true,
              },
            },
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
      followers: user.followers.map((follow) => {
        return {
          id: follow.follower.id,
          username: follow.follower.username,
          ...(follow.follower.avatar_url && { avatar: follow.follower.avatar_url }),
        };
      }),
      following: user.following.map((follow) => {
        return {
          id: follow.following.id,
          username: follow.following.username,
          ...(follow.following.avatar_url && { avatar: follow.following.avatar_url }),
        };
      }),
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

    wasted.watchedEpisodes = _watchedEpisodes.length;
    wasted.watchedHours = Math.ceil((_watchedEpisodes.length * 50) / 60);
    wasted.totalDays = Math.ceil(wasted.totalHours / 60);
    wasted.watchedDays = Math.floor(wasted.watchedHours / 60);

    return {
      user: userDTO,
      watchedShows,
      wasted,
      activity: await _getGroupedActivity(userId),
      stats: {
        episodesThisYear: await _getWatchedEpisodesThisYear(userId),
        lists: await _getListsCount(userId),
        following: user.following.length,
        followed: user.followers.length,
      },
      ratings: await _getRatings(userId),
      heatmap: await _getActionHeatmap(userId),
      following: userDTO.following,
    };
  } catch (err) {
    console.log("🚀 ~ getPage ~ err:", err);
    throw new InternalError();
  }
};

export const createList = async (userId: number, input: ICreateListInput) => {
  console.log("🚀 ~ createList ~ userId:", userId);
  try {
    const tagsDTO = (await _getTags(userId, input.tags)) ?? [];
    // console.log("🚀 ~ createList ~ tagsDTO:", tagsDTO);

    const listType = () => {
      switch (input.type) {
        case "episode":
          return ListType.EPISODE;
        case "season":
          return ListType.SEASON;
        case "show":
          return ListType.SHOW;
      }
    };

    const list = await db.list.create({
      data: {
        user: { connect: { id: userId } },
        title: input.title,
        type: listType(),
        ...(input.summary && { summary: input.summary }),
      },
      select: {
        id: true,
        title: true,
        summary: true,
        type: true,
        is_ranked: true,
      }
    });

    const listItems = await db.listItem.createManyAndReturn({
      data: input.items.map((itemId) => {
        return {
          list_id: list.id,
          ...(input.type === "episode" && { item_episode_id: itemId }),
          ...(input.type === "season" && { item_season_id: itemId }),
          ...(input.type === "show" && { item_show_id: itemId }),
        };
      }),
      select: {
        ...(input.type === "episode" && {
          item_episode: {
            select: {
              id: true,
              show_id: true,
              title: true,
              thumb_url: true,
              number: true,
              season_number: true,
            },
          },
        }),
        ...(input.type === "season" && { item_season: {
          select: {
            id: true,
            show_id: true,
            poster_url: true,
            number: true,
          }
        } }),
        ...(input.type === "show" && { item_show: {
          select: {
            id: true,
            poster_url: true,
            title: true,
            date_started: true,
            date_ended: true,
          }
        } }),
      },
    });

    const listTags = await db.listTag.createManyAndReturn({
      data: tagsDTO.map((tag) => {
        return {
          list_id: list.id,
          tag_id: tag.id, 
        };
      }),
      select: {
        tag: true,
      }
    })

    return { ...list, items: listItems, tags: listTags };
  } catch (err) {
    console.log("🚀 ~ createList ~ err:", err);
    return new InternalError();
  }
};

export const updateList = async (userId: number) => {};

export const deleteList = async (userId: number) => {};

const _getActionHeatmap = async (userId: number) => {
  const actions = await db.action.findMany({
    where: {
      user_id: userId,
    },
    select: {
      createdAt: true,
    },
  });

  const heatmap = actions.reduce((acc, action) => {
    const date = new Date(action.createdAt).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const result = Object.entries(heatmap).map(([date, count]) => ({
    date,
    count,
  }));

  return result;
};

const _getWatchedEpisodesThisYear = async (userId: number) => {
  const DAYS = 365;
  const now = new Date();
  const dateLimit = new Date(now.getTime() - DAYS * 24 * 60 * 60 * 1000); // 364 days

  const episodesThisYear = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      watched_episodes: {
        where: {
          createdAt: {
            gte: dateLimit,
          },
        },
      },
    },
  });

  return episodesThisYear?.watched_episodes.length || 0;
};

const _getListsCount = async (userId: number) => {
  const lists = await db.list.count({
    where: {
      user_id: userId,
    },
  });

  return lists || 0;
};

const _getFollow = async (userId: number, mode: "follower" | "following") => {
  if (mode === "follower") {
    const followers = await db.user.findMany({
      where: {
        followers: {
          some: {
            followingId: userId,
          },
        },
      },
    });

    return followers;
  }

  if (mode === "following") {
    const following = await db.user.findMany({
      where: {
        following: {
          some: {
            followerId: userId,
          },
        },
      },
    });

    return following;
  }

  return [];
};

const _getGroupedActivity = async (userId: number) => {
  const _rawActivity = await getUserActions(userId);

  const activityByDate = _rawActivity.reduce((acc, action) => {
    const date = new Date(action.createdAt).toISOString().split("T")[0];
    acc[date] = acc[date] || [];
    acc[date].push(action);
    return acc;
  }, {} as { [key: string]: Action[] });

  const result = Object.entries(activityByDate).map(([date, items]) => ({
    date: `${date}T00:00:00.000Z`,
    items,
  }));

  return result;
};

const _getRatings = async (userId: number) => {
  const ratings = await db.episodeRating.groupBy({
    by: ["rating"],
    where: {
      user_id: userId,
    },
    _count: {
      _all: true,
    },
  });

  const ratingMap = new Map(ratings.map((rating) => [rating.rating.toString(), rating._count._all]));
  const result: Record<string, number> = {
    "0.5": 0,
    "1": 0,
    "1.5": 0,
    "2": 0,
    "2.5": 0,
    "3": 0,
    "3.5": 0,
    "4": 0,
    "4.5": 0,
    "5": 0,
  };
  for (const [key, value] of Object.entries(result)) {
    result[key] = ratingMap.get(key) || 0;
  }

  return result;
};

const _getTags = async (userId: number, tags: ICreateListInput["tags"]) => {
  try {
    const resTags = [];

    if (!tags?.length) {
      return [];
    }

    for (const tag of tags) {
      const foundTag = await db.tag.findFirst({
        where: {
          user_id: userId,
          name: tag,
        },
      });

      if (foundTag) {
        resTags.push(foundTag);
        continue;
      }

      const newTag = await db.tag.create({
        data: {
          user: { connect: { id: userId } },
          name: tag,
        },
      });

      if (newTag) resTags.push(newTag);
    }

    return resTags;
  } catch (err) {
    console.log("🚀 ~ _getTags ~ err:", err);
    throw new InternalError();
  }
};

const _likeShow = async (userId: number, input: ILikeInput) => {};

const _likeSeason = async (userId: number, input: ILikeInput) => {};

const _likeEpisode = async (userId: number, input: ILikeInput) => {};
