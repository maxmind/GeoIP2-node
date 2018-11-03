/* tslint:disable:max-classes-per-file */

import mmdb = require('maxmind');
import { ICityResponse, ICountryResponse, IMaxMind } from './types';

/** Class representing the model of a "Country" response **/
export class Country {
  public readonly continent: mmdb.IContinent | undefined;
  public readonly country: mmdb.ICountry | undefined;
  public readonly maxmind: IMaxMind | undefined;
  public readonly registered_country: mmdb.IBaseCountry | undefined;
  public readonly represented_country: mmdb.IRepresentedCountry | undefined;
  public readonly traits: mmdb.ITraits;

  /**
   * Instanstiates a "Country" using fields from the response
   *
   * @param fields The GeoIP2 response
   */
  public constructor(fields: ICountryResponse) {
    this.continent = fields.continent;
    this.country = fields.country;
    this.maxmind = fields.maxmind;
    this.registered_country = fields.registered_country;
    this.represented_country = fields.represented_country;
    this.traits = fields.traits as mmdb.ITraits;
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
   * @param fields The GeoIP2 response
   */
  public constructor(fields: ICityResponse) {
    super(fields);
    this.city = fields.city;
    this.location = fields.location;
    this.postal = fields.postal;
    this.subdivisions = fields.subdivisions;
  }
}
