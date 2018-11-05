/* tslint:disable:max-classes-per-file */

import mmdb = require('maxmind');
import { CityResponse, CountryResponse, MaxMindField } from './types';

/** Class representing the model of a "Country" response **/
export class Country {
  public readonly continent: mmdb.IContinent | undefined;
  public readonly country: mmdb.ICountry | undefined;
  public readonly maxmind: MaxMindField | undefined;
  public readonly registered_country: mmdb.IBaseCountry | undefined;
  public readonly represented_country: mmdb.IRepresentedCountry | undefined;
  public readonly traits: mmdb.ITraits;

  /**
   * Instanstiates a "Country" using fields from the response
   *
   * @param response The GeoIP2 response
   */
  public constructor(response: CountryResponse) {
    this.continent = response.continent;
    this.country = response.country;
    this.maxmind = response.maxmind;
    this.registered_country = response.registered_country;
    this.represented_country = response.represented_country;
    this.traits = response.traits as mmdb.ITraits;
  }
}

/** Class representing the model of a "City" response **/
export class City extends Country {
  public readonly city: mmdb.ICity | undefined;
  public readonly location: mmdb.ILocation | undefined;
  public readonly postal: mmdb.IPostal | undefined;
  public readonly subdivisions: mmdb.ISubdivisions[] | undefined;

  /**
   * Instanstiates a "City" using fields from the response
   *
   * @param response The GeoIP2 response
   */
  public constructor(response: CityResponse) {
    super(response);
    this.city = response.city;
    this.location = response.location;
    this.postal = response.postal;
    this.subdivisions = response.subdivisions;
  }
}
