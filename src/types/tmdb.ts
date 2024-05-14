export interface ITmdbShowDetails {
  adult: boolean;
  backdrop_path: string | null;
  episode_run_time: number[];
  first_air_date: string;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string | null;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: LastEpisodeToAir | null;
  name: string;
  next_episode_to_air: null;
  networks: INetworkResp[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_countries: ProductionCountry[];
  seasons: ISeasonResp[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
  images: Images;
  external_ids: ExternalIds;
  videos: {
    results: IVideoResp[];
  };
}

export interface IVideoResp {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: 1080;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

interface ExternalIds {
  imdb_id: string;
  tvdb_id: number;
}

interface LastEpisodeToAir {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string | null;
}

export interface INetworkResp {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface ISeasonResp {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

interface Image {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

interface Images {
  backdrops: Image[];
  posters: Image[];
}

export interface IEpisodeResp {
  air_date: string;
  episode_number: number;
  episode_type: string;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}

export interface ISeasonDetailResp {
  _id: string;
  air_date: string;
  episodes: IEpisodeResp[];
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export interface ICastResp {
  gender: number;
  id: number;
  name: string;
  original_name: string;
  profile_path: string;
  roles: {
    credit_id: string;
    character: string;
    episode_count: number;
  }[];
  total_episode_count: number;
  order: number;
}
