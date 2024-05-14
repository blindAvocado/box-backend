import { Request, Response } from "express";
import { db } from "../utils/db.server";
import { ICastResp, INetworkResp, IPersonResp, ISeasonDetailResp, ITmdbShowDetails, IVideoResp } from "../types/tmdb";
import { EAirStatus } from "../types/show";
import path from "path";
import fs from "fs";
import { sleep } from "../utils/base";

const axios = require("axios");

function normalizeAirStatus(status: string): EAirStatus {
  switch (status) {
    case "Ended":
      return EAirStatus.ENDED;
    default:
      return EAirStatus.ENDED;
  }
}

export async function addShowFromTMDB(req: Request, res: Response) {
  const tmdbId: string = req.params.tmdb;

  const existingShow = await db.show.findUnique({
    where: { id: parseInt(tmdbId, 10) },
    include: {
      network: true,
      country: true,
      language: true,
      seasons: true,
      episodes: true,
      genres: true,
      actors: true,
    },
  });

  if (existingShow) {
    res.status(200).json({ message: "Show already exists in DB", show: existingShow });
    return;
  }

  try {
    const showResponse = await axios.get(
      `https://api.themoviedb.org/3/tv/${tmdbId}?language=en-US&append_to_response=images,external_ids,videos&include_image_language=en,null`
    );
    const showData: ITmdbShowDetails = showResponse.data;

    const seasonsData: ISeasonDetailResp[] = [];
    for (let i = 1; i <= showData.number_of_seasons; i++) {
      const seasonsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${tmdbId}/season/${i}`);
      seasonsData.push(seasonsResponse.data as ISeasonDetailResp);
    }

    const savedShow = await saveShowToDatabase(showData, seasonsData);

    res.status(200).json({ message: "Show added successfully", show: savedShow });
  } catch (error) {
    console.error("Error adding show from TMDB:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function saveTMDBImage(imagePath: string) {
  try {
    const imageUrl = `https://image.tmdb.org/t/p/original${imagePath}`;

    const response = await axios.get(imageUrl, {
      responseType: "stream",
    });

    const directory = "C:\\Users\\Kirill\\Desktop\\box\\project\\box-backend\\public\\images";

    const localImagePath = path.join(directory, path.basename(imagePath));

    if (fs.existsSync(localImagePath)) {
      console.log("Image already exists in directory:", localImagePath);
      return localImagePath;
    }

    const writer = fs.createWriteStream(localImagePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    return imagePath;
  } catch (error: any) {
    console.error("Error saving image:", error.message);
  }
}

async function saveShowToDatabase(showData: ITmdbShowDetails, seasonsData: ISeasonDetailResp[]) {
  if (showData.poster_path) saveTMDBImage(showData.poster_path);
  if (showData.backdrop_path) saveTMDBImage(showData.backdrop_path);

  const youtubeId = getYoutubeId(showData.videos.results);
  const networkId = await getNetworkId(showData.networks[0]);
  const languageId = await getLanguageId(showData.languages[0]);
  const countryId = await getCountryId(showData.origin_country[0]);
  const actorsId = await getActorsId(showData.id);

  const newShow = await db.show.create({
    data: {
      id: showData.id,
      title: showData.name,
      date_started: new Date(showData.first_air_date),
      ...(showData.last_air_date && { date_ended: new Date(showData.last_air_date) }),
      season_count: showData.number_of_seasons,
      episode_count: showData.number_of_episodes,
      poster_url: showData.poster_path,
      ...(showData.backdrop_path && { thumb_url: showData.backdrop_path }),
      ...(showData.tagline && { tagline: showData.tagline }),
      ...(showData.overview && { summary: showData.overview }),
      ...(showData.episode_run_time[0] && { average_runtime: showData.episode_run_time[0] }),
      ...(youtubeId && { trailer_url: youtubeId }),
      imdb: showData.external_ids.imdb_id,
      tvdb: showData.external_ids.tvdb_id.toString(),
      tmdb: showData.id.toString(),
      air_status: normalizeAirStatus(showData.status),
      genres: {
        connect: showData.genres.map((genre) => ({ id: genre.id })),
      },
      network: {
        connect: { id: networkId },
      },
      country: {
        connect: { id: countryId },
      },
      language: {
        connect: { id: languageId },
      },
      actors: {
        connect: actorsId?.map((id) => ({ id })),
      },
      seasons: {
        create: seasonsData.map((season) => {
          if (season.poster_path) saveTMDBImage(season.poster_path);

          for (const episode of season.episodes) {
            if (episode.still_path) saveTMDBImage(episode.still_path);
          }

          return {
            id: season.id,
            poster_url: season.poster_path,
            date_started: new Date(season.air_date),
            number: season.season_number,
            episode_count: season.episodes.length,
            episodes: {
              create: season.episodes.map((episode) => ({
                id: episode.id,
                title: episode.name,
                ...(episode.still_path && { thumb_url: episode.still_path }),
                ...(episode.overview && { summary: episode.overview }),
                number: episode.episode_number,
                date_aired: new Date(episode.air_date),
                show: {
                  connect: { id: episode.show_id },
                },
              })),
            },
          };
        }),
      },
    },
    include: {
      network: true,
      country: true,
      language: true,
      seasons: true,
    },
  });

  return newShow;
}

async function getNetworkId(network: INetworkResp) {
  const existingNetwork = await db.network.findUnique({
    where: { id: network.id },
  });

  let networkId;
  if (existingNetwork) {
    networkId = existingNetwork.id;
  } else {
    const countryId = await getCountryId(network.origin_country);

    const newNetwork = await db.network.create({
      data: {
        id: network.id,
        name: network.name,
        country: {
          connect: { id: countryId },
        },
      },
    });
    networkId = newNetwork.id;
  }

  return networkId;
}

async function getCountryId(countryCode: string) {
  const existingCountry = await db.country.findFirst({
    where: { code: countryCode },
  });

  return existingCountry?.id ?? 229;
}

async function getLanguageId(languageCode: string) {
  const existingLanguage = await db.language.findFirst({
    where: { code: languageCode },
  });

  return existingLanguage?.id ?? 108;
}

async function getActorsId(showId: number) {
  try {
    const creditsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${showId}/aggregate_credits`);

    const cast = (creditsResponse.data.cast as ICastResp[]).slice(0, 10);

    for (const actor of cast) {
      if (actor.profile_path) saveTMDBImage(actor.profile_path);

      const existingActor = await db.actor.findFirst({
        where: { tmdb: String(actor.id) },
      });

      if (!existingActor) {
        await sleep(1000);
        const actorDetailsResponse = await axios.get(`https://api.themoviedb.org/3/person/${actor.id}`);

        const actorDetails = actorDetailsResponse.data as IPersonResp;

        await db.actor.create({
          data: {
            id: actor.id,
            name: actor.name,
            imdb: actorDetails.imdb_id,
            tmdb: String(actor.id),
            ...(actorDetails.birthday && { birthdate: new Date(actorDetails.birthday) }),
            ...(actorDetails.deathday && { deathdate: new Date(actorDetails.deathday) }),
            profile_url: actor.profile_path,
          },
        });
      }
    }

    return cast.map((actor) => actor.id);
  } catch (err) {
    console.error(err);
  }
}

function getYoutubeId(videos: IVideoResp[]) {
  if (!videos.length) {
    return null;
  }

  const res = videos.filter((video) => video.site === "YouTube").map((video) => ({ id: video.key }));

  return res[0].id;
}
