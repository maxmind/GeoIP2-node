import mmdb = require('maxmind');

/** Class representing the model of a "City" response **/
export class City {
  public city: mmdb.ICity | undefined;
  public continent: mmdb.IContinent | undefined;
  public country: mmdb.ICountry | undefined;
  public location: mmdb.ILocation | undefined;
  public registered_country: mmdb.IBaseCountry | undefined;
  public represented_country: mmdb.IRepresentedCountry | undefined;
  public subdivisions: mmdb.ISubdivisions[] | undefined;
  public traits: mmdb.ITraits | undefined;

  /**
   * Instanstiates a "City" using fields from the response
   *
   * @param fields The GeoIP2 response
   */
  public constructor(fields: mmdb.IFields) {
    this.city = fields.city;
    this.continent = fields.continent;
    this.country = fields.country;
    this.location = fields.location;
    this.registered_country = fields.registered_country;
    this.represented_country = fields.represented_country;
    this.subdivisions = fields.subdivisions;
    this.traits = fields.traits;
  }
}
