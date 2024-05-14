import { Prisma } from "@prisma/client";

export interface IShowDTO {
  id: number;
  title: string;
  overview?: string;
  tagline?: string;
  posterPath: string;
  backdropPath?: string;
  properties: IProperties;
  actors?: IActor[];
  community: ICommunity;
  bestEpisodes?: IBestEpisode[];
  seasons: ISeason[];
  episodes: IEpisode[];
  friends?: IUserRating[];
}

interface IProperties {
  dateStarted?: Date;
  dateEnded?: Date;
  airStatus: TAirStatus;
  countries: string[];
  network: INetwork;
  genres: IGenre[];
  averageRuntime?: number;
  totalRuntime: number;
  episodes: number;
  seasons: number;
}

interface INetwork {
  id: number;
  name: string;
}

interface IGenre {
  id: number;
  name: string;
}

export interface IActor {
  id: number;
  name: string;
  profilePath?: string;
  character?: string;
  order?: number;
}

export interface ICommunity {
  watching: number;
  lists: number;
  favorite: number;
  rating: IRating;
}

export interface IBestEpisode {
  id: number;
  seasonNumber: number;
  episodeNumber: number;
  rating: Prisma.Decimal | string;
  title: string;
}

export interface ISeason {
  id: number;
  number: number;
  episodes: number;
  airdate?: Date;
  rating: string | Prisma.Decimal;
  name?: string;
  posterPath?: string;
}

export interface IEpisode {
  id: number;
  episodeNumber: number;
  seasonNumber: number;
  name: string;
  showId: number;
  rating: IRating;
  comments?: number;
  airdate: string | Date;
  runtime: number;
}

export interface IRating {
  average: string | Prisma.Decimal;
  votes: number;
}

export interface IUserRating {
  id: number,
  username: string,
  avatar?: string,
  rating: number,
}

export type TAirStatus = "DEAD" | "AIRING" | "PAUSED"

export enum EAirStatus {
  ON_AIR = "ON_AIR",
  ENDED = "ENDED",
  PAUSED = "PAUSED"
}