import { FingerprintResult } from "express-fingerprint";

export interface IRequest {
  fingerprint: FingerprintResult | undefined,
}

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never
