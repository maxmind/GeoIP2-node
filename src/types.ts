import mmdb = require('maxmind');

export interface IMaxMind {
  queries_remaining: number;
}

export interface ICountryResponse extends mmdb.ICountryResponse {
  maxmind?: IMaxMind;
}

export interface ICityResponse extends mmdb.ICityResponse {
  maxmind?: IMaxMind;
}
