import camelcaseKeys = require('camelcase-keys');
import * as records from '../records';
import { CountryResponse, Json } from '../types';

/** Class representing the model of a "Country" response **/
export default class Country {
  public readonly continent: records.ContinentRecord | {};
  public readonly country: records.CountryRecord | {};
  public readonly maxmind: records.MaxMindRecord | {};
  public readonly registeredCountry: records.RegisteredCountryRecord | {};
  public readonly representedCountry: records.RepresentedCountryRecord | {};
  public readonly traits: records.TraitsRecord;

  /**
   * Instantiates a "Country" using fields from the response
   *
   * @param response The GeoIP2 response
   */
  public constructor(response: CountryResponse) {
    const camelcaseResponse = (camelcaseKeys(response as Json, {
      deep: true,
      exclude: [/\-/],
    }) as unknown) as Country;

    this.continent = camelcaseResponse.continent || {};
    this.country = camelcaseResponse.country || {};
    this.maxmind = camelcaseResponse.maxmind || {};
    this.registeredCountry =
      this.setBooleanRegisteredCountry(camelcaseResponse.registeredCountry) ||
      {};
    this.representedCountry = camelcaseResponse.representedCountry || {};
    this.traits = this.setBooleanTraits(camelcaseResponse.traits || {});
  }

  private setBooleanTraits(traits: any) {
    const booleanTraits = [
      'isAnonymous',
      'isAnonymousProxy',
      'isAnonymousVpn',
      'isHostingProvider',
      'isLegitimateProxy',
      'isPublicProxy',
      'isSatelliteProvider',
      'isTorExitNode',
    ];

    booleanTraits.forEach(trait => {
      traits[trait] = !!traits[trait];
    });

    return traits as records.TraitsRecord;
  }

  private setBooleanRegisteredCountry(country: any) {
    if (country) {
      country.isInEuropeanUnion = !!country.isInEuropeanUnion;
    }
    return country as records.RegisteredCountryRecord;
  }
}
