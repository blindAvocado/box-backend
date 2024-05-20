export interface ICreateCommentInput {
  parentCommentId?: number | null;
  body: string;
  attachedImageUrl?: string;
}

export interface IRateInput {
  type: "show" | "episode",
  id: number,
  value: number,
}

export interface IWatchInput {
  id: number,
  value: boolean,
}

export interface ILikeInput {
  type: "show" | "season" | "episode",
  id: number,
  value: boolean,
}

export interface IFollowInput {
  id: number,
}

export type TStatusInput = "WATCHING" | "GOING_TO" | "STOPPED" | "NOT_WATCHING";