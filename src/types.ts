import {
  CityResponse as mmdbCityResponse,
  CountryResponse as mmdbCountryResponse,
} from 'maxmind';
import { MaxMindRecord } from './records';

export interface CountryResponse extends mmdbCountryResponse {
  maxmind?: MaxMindRecord;
}

export interface CityResponse extends mmdbCityResponse {
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
