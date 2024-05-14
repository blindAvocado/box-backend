import { Prisma } from "@prisma/client";
import { IAction, IActionType } from "../types/base";
import { db } from "../utils/db.server";
import { InternalError, NotFound } from "../utils/errors";
import { IRateInput } from "../types/inputs";

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

export const getUserActions = async (userId: number, date?: Date) => {
  try {
    const now = new Date();
    const dateLimit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days

    const actions = await db.action.findMany({
      where: {
        user_id: userId,
        createdAt: {
          gte: dateLimit,
        },
      },
    });

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

      if (!existingRating) {
        ratingRecord = await db.showRating.create({
          data: {
            user: { connect: { id: userId } },
            show: { connect: { id: input.id } },
            rating: input.value,
          },
        });
      } else {
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

      if (!isRatingEqual) {
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
      const votesCount = ratings.length;

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

export const getPage = async (userId: number) => {
};
