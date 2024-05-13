import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Fingerprint from "express-fingerprint";
import cookieParser from "cookie-parser";
import AuthRouter from "./routers/auth";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(cookieParser());
// app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(cors({ credentials: true }));
app.use(express.json());
app.use(
  //@ts-ignore
  Fingerprint({
    //@ts-ignore
    parameters: [Fingerprint.useragent, Fingerprint.acceptHeaders],
  })
);
app.use("/api/auth", AuthRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
