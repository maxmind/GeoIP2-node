import mmdb = require('maxmind');

export interface MaxMindRecord {
  queries_remaining: number;
}

export interface CountryResponse extends mmdb.CountryResponse {
  maxmind?: MaxMindRecord;
}

export interface CityResponse extends mmdb.CityResponse {
  maxmind?: MaxMindRecord;
}
