import mmdb = require('maxmind');
import { ICityResponse, IMaxMind } from './types';

/** Class representing the model of a "City" response **/
export class City {
  public readonly city: mmdb.ICity | undefined;
  public readonly continent: mmdb.IContinent | undefined;
  public readonly country: mmdb.ICountry | undefined;
  public readonly location: mmdb.ILocation | undefined;
  public readonly maxmind: IMaxMind | undefined;
  public readonly registered_country: mmdb.IBaseCountry | undefined;
  public readonly represented_country: mmdb.IRepresentedCountry | undefined;
  public readonly subdivisions: mmdb.ISubdivisions[] | undefined;
  public readonly traits: mmdb.ITraits | undefined;

  /**
   * Instanstiates a "City" using fields from the response
   *
   * @param fields The GeoIP2 response
   */
  public constructor(fields: ICityResponse) {
    this.city = fields.city;
    this.continent = fields.continent;
    this.country = fields.country;
    this.location = fields.location;
    this.maxmind = fields.maxmind;
    this.registered_country = fields.registered_country;
    this.represented_country = fields.represented_country;
    this.subdivisions = fields.subdivisions;
    this.traits = fields.traits;
  }
}
