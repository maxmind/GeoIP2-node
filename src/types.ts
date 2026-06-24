import * as mmdb from 'maxmind';
import { MaxMindRecord } from './records.js';

export interface CountryResponse extends mmdb.CountryResponse {
  maxmind?: MaxMindRecord;
}

export interface CityResponse extends mmdb.CityResponse {
  maxmind?: MaxMindRecord;
}

export interface WebServiceClientError {
  code: string;
  error: string;
  status?: number;
  url: string;
  /**
   * The underlying error that caused this one, when available (for example,
   * the network error behind a `FETCH_ERROR`).
   */
  cause?: unknown;
}

export interface Json {
  [key: string]: unknown;
}

export type ConnectionType =
  | 'Cable/DSL'
  | 'Cellular'
  | 'Corporate'
  | 'Dialup'
  | 'Satellite';
