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
    this.registered_country =
      this.setBooleanRegisteredCountry(response.registered_country) || {};
    this.represented_country = response.represented_country || {};
    this.traits = this.setBooleanTraits(response.traits);
  }

  private setBooleanTraits(traits: any) {
    const booleanTraits = [
      'is_anonymous',
      'is_anonymous_proxy',
      'is_anonymous_vpn',
      'is_hosting_provider',
      'is_legitimate_proxy',
      'is_public_proxy',
      'is_satellite_provider',
      'is_tor_exit_node',
    ];

    booleanTraits.forEach(trait => {
      traits[trait] = !!traits[trait];
    });

    return traits as mmdb.TraitsRecord;
  }

  private setBooleanRegisteredCountry(records: any) {
    if (records) {
      records.is_in_european_union = !!records.is_in_european_union;
    }
    return records as mmdb.RegisteredCountryRecord;
  }
}
