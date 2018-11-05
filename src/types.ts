import mmdb = require('maxmind');

export interface MaxMindField {
  queries_remaining: number;
}

export interface CountryResponse extends mmdb.ICountryResponse {
  maxmind?: MaxMindField;
}

export interface CityResponse extends mmdb.ICityResponse {
  maxmind?: MaxMindField;
}
