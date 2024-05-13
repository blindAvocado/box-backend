import { FingerprintResult } from "express-fingerprint";

export interface IRequest {
  fingerprint: FingerprintResult | undefined,
}