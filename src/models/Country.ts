import mmdb = require('maxmind');
import { CountryResponse, MaxMindRecord } from '../types';

/** Class representing the model of a "Country" response **/
export default class Country {
  public readonly continent: mmdb.ContinentRecord | {};
  public readonly country: mmdb.CountryRecord | {};
  public readonly maxmind: MaxMindRecord | {};
  public readonly registered_country: mmdb.RegisteredCountryRecord | {};
  public readonly represented_country: mmdb.RepresentedCountryRecord | {};
  public readonly traits: mmdb.TraitsRecord;

  /**
   * Instanstiates a "Country" using fields from the response
   *
   * @param response The GeoIP2 response
   */
  public constructor(response: CountryResponse) {
    this.continent = response.continent || {};
    this.country = response.country || {};
    this.maxmind = response.maxmind || {};
    this.registered_country = response.registered_country || {};
    this.represented_country = response.represented_country || {};
    this.traits = response.traits as mmdb.TraitsRecord;
  }
}
