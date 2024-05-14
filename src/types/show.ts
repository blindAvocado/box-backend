export interface IShowDTO {
  id: number;
  title: string;
  date_started?: Date;
  date_ended?: Date;
  season_count: number;
  episode_count: number;
  poster_url: string;
  thumb_url?: string;
  imdb?: string;
  tvdb?: string;
  tmdb?: string;
  trailer_url?: string;
  network: INetworkDTO;
  network_id: number;
  air_status: EAirStatus;
  summary?: string;
  tagline?: string;
  country: Country;
  country_id: number;
  users_watched: number;
  average_runtime?: number;
  average_rating?: number;
  votes_count: number;
  language: Language;
  language_id: number;
  updatedAt: Date;
  genres: Genre[];
  actors: Actor[];
  seasons: ISeasonDTO[];
  episodes: IEpisodeDTO[];
  // show_translation: ShowTranslation[];
  // permissions: Permission[];
  // list_items: ListItem[];
  // users_rating: ShowRating[];
  // users_favorite: FavoriteShow[];
  // users_watched_arr: WatchedShow[];
}

export enum EAirStatus {
  ON_AIR = "ON_AIR",
  ENDED = "ENDED",
  PAUSED = "PAUSED"
}


export interface ISeasonDTO {
  id: number;
  // show: Show;
  show_id: number;
  poster_url: string;
  thumb_url?: string | null;
  date_started?: Date | null;
  tmdb?: string | null;
  number: number;
  episode_count: number;
  votes_count: number;
  average_rating: number;
  episodes: IEpisodeDTO[];
  // list_items: ListItem[];
  // users_favorite: FavoriteSeason[];
}

interface IEpisodeDTO {
  id: number;
  show: IShowDTO;
  show_id: number;
  title: string;
  date_aired: Date;
  thumb_url?: string | null;
  summary?: string | null;
  special?: boolean;
  season_id: number;
  number: number;
  average_rating?: number;
  votes_count?: number;
  // episode_translation: EpisodeTranslation[];
  // list_items: ListItem[];
  // comments: Comment[];
  // users_rating: EpisodeRating[];
  // users_favorite: FavoriteEpisode[];
  // users_watched: WatchedEpisode[];
}

interface Genre {
  id: number;
  name: string;
}

export interface INetworkDTO {
  id: number;
  name: string;
  country: Country;
  country_id: number;
}

interface Country {
  id: number;
  code: string;
  full_name: string;
}

interface Actor {
  id: number;
  name: string;
  profile_url?: string | null;
  imdb?: string | null;
  tmdb?: string | null;
  birthdate?: Date | null;
  deathdate?: Date | null;
  updatedAt: Date;
}

interface Language {
  id: number;
  code: string;
  full_name: string;
  // shows: Show[];
  // show_translation: ShowTranslation[];
  // episode_translation: EpisodeTranslation[];
}
