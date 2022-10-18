import camelcaseKeys = require('camelcase-keys');
import * as records from '../records';
import { CountryResponse, Json } from '../types';

/** Class representing the model of a "Country" response **/
export default class Country {
  /**
   * The continent for the requested IP address.
   */
  public readonly continent?: records.ContinentRecord;
  /**
   * The country for the requested IP address. This object represents the
   * country where MaxMind believes the end user is located.
   */
  public readonly country?: records.CountryRecord;
  /**
   * The MaxMind record containing data related to your account.
   */
  public readonly maxmind?: records.MaxMindRecord;
  /**
   * The registered country record for the requested IP address. This record
   * represents the country where the ISP has registered a given IP block and
   * may differ from the user's country.
   */
  public readonly registeredCountry?: records.RegisteredCountryRecord;
  /**
   * The represented country record for the requested IP address. The
   * represented country is used for things like military bases or embassies.
   * It is only present when the represented country differs from the country.
   */
  public readonly representedCountry?: records.RepresentedCountryRecord;
  /**
   * The traits for the requested IP address.
   */
  public readonly traits: records.TraitsRecord;

  /**
   * Instantiates a "Country" using fields from the response
   *
   * @param response The GeoIP2 response
   */
  public constructor(
    response: CountryResponse,
    ipAddress?: string,
    network?: string
  ) {
    const camelcaseResponse = camelcaseKeys(response as Json, {
      deep: true,
      exclude: [/-/],
    }) as unknown as Country;

    this.continent = camelcaseResponse.continent || undefined;
    this.country = camelcaseResponse.country || undefined;
    this.maxmind = camelcaseResponse.maxmind || undefined;
    this.registeredCountry =
      this.setBooleanRegisteredCountry(camelcaseResponse.registeredCountry) ||
      undefined;
    this.representedCountry = camelcaseResponse.representedCountry || undefined;
    this.traits = this.setBooleanTraits(camelcaseResponse.traits || {});
    this.traits.ipAddress ??= ipAddress;
    this.traits.network ??= network;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private setBooleanTraits(traits: any) {
    const booleanTraits = [
      'isAnonymous',
      'isAnonymousProxy',
      'isAnonymousVpn',
      'isHostingProvider',
      'isLegitimateProxy',
      'isPublicProxy',
      'isResidentialProxy',
      'isSatelliteProvider',
      'isTorExitNode',
    ];

    booleanTraits.forEach((trait) => {
      traits[trait] = !!traits[trait];
    });

    return traits as records.TraitsRecord;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private setBooleanRegisteredCountry(country: any) {
    if (country) {
      country.isInEuropeanUnion = !!country.isInEuropeanUnion;
    }
    return country as records.RegisteredCountryRecord;
  }
}
