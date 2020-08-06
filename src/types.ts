import mmdb = require('maxmind');
import { MaxMindRecord } from './records';

export interface CountryResponse extends mmdb.CountryResponse {
  maxmind?: MaxMindRecord;
}

export interface CityResponse extends mmdb.CityResponse {
  maxmind?: MaxMindRecord;
}

export interface WebServiceClientError {
  code: string;
  error: string;
  url: string;
}

export interface Json {
  [key: string]: unknown;
}

export type ConnectionType = 'Cable/DSL' | 'Cellular' | 'Corporate' | 'Dialup';
