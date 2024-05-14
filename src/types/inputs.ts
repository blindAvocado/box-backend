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

export type TStatusInput = "WATCHING" | "GOING_TO" | "STOPPED" | "NOT_WATCHING";