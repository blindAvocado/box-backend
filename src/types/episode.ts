import { Prisma } from "@prisma/client";

export interface IEpisodeDTO {
  id: number;
  episodeNumber: number;
  seasonNumber: number;
  name: string;
  overview?: string;
  airdate: string | Date;
  runtime: number;
  showId: number;
  watched: number;
  showName: string;
  stillPath?: string;
  rating: IRating;
  personal?: IEpisodePersonal;
  comments_count: number;
  comments?: ICommentDTO[];
  otherEpisodes?: IOtherEpisode[];
}

interface IRating {
  average: string | Prisma.Decimal;
  votes: number;
}

export interface IEpisodePersonal {
  watched: boolean;
  watchedDate?: Date;
  rating: string | Prisma.Decimal;
  favorite: boolean;
  commentsOpen: boolean;
  friends?: IUserRating[];
}

interface IUserRating {
  id: number;
  username: string;
  avatar?: string;
  rating: number;
}

export interface ICommentDTO {
  id: number;
  createdAt: Date | string;
  owner: {
    id: number;
    username: string;
  };
  body: {
    text: string;
    image?: string;
  };
  subcomments?: ICommentDTO[];
}

export interface IOtherEpisode {
  id: number;
  episodeNumber: number;
  seasonNumber: number;
  name: string;
}
