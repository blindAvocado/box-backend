import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Fingerprint from "express-fingerprint";
import cookieParser from "cookie-parser";
import axios from "axios";
import path from "path";

import AuthRouter from "./routers/auth";
import AdminRouter from "./routers/admin";
import EpisodeRouter from "./routers/episode";
import ShowRouter from "./routers/show";
import UserRouter from "./routers/user";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

axios.defaults.headers.common["Authorization"] = `Bearer ${process.env.TMDB_TOKEN}`;

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(
  //@ts-ignore
  Fingerprint({
    //@ts-ignore
    parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders],
  })
);
app.use(express.static(path.join(process.cwd(), "public")));

app.use("/api/auth", AuthRouter);
app.use("/api/manage", AdminRouter);
app.use("/api/episode", EpisodeRouter);
app.use("/api/show", ShowRouter);
app.use("/api/user", UserRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
