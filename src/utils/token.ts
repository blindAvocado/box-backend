import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = async (payload: any) => {
  return await jwt.sign(
    payload,
    (process.env.JWT_ACCESS_SECRET as string),
    {
      expiresIn: "30m",
    }
  )
};

export const generateRefreshToken = async (payload: any) => {
  return await jwt.sign(
    payload,
    (process.env.JWT_REFRESH_SECRET as string),
    {
      expiresIn: "30d",
    }
  )
};