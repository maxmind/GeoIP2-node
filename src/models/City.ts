import mmdb = require('maxmind');
import { CityResponse } from '../types';
import Country from './Country';

/** Class representing the model of a "City" and "Enterprise" response **/
export default class City extends Country {
  public readonly city: mmdb.CityRecord | {};
  public readonly location: mmdb.LocationRecord | {};
  public readonly postal: mmdb.PostalRecord | {};
  public readonly subdivisions: mmdb.SubdivisionsRecord[] | [];

  /**
   * Instanstiates a "City" using fields from the response
   *
   * @param response The GeoIP2 response
   */
  public constructor(response: CityResponse) {
    super(response);
    this.city = response.city || {};
    this.location = response.location || {};
    this.postal = response.postal || {};
    this.subdivisions = response.subdivisions || [];
  }
}
