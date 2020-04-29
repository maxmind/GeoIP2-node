import camelcaseKeys = require('camelcase-keys');
import * as records from '../records';
import { CityResponse, Json } from '../types';
import Country from './Country';

/** Class representing the model of a "City" response **/
export default class City extends Country {
  /**
   * The city for the requested IP address.
   */
  public readonly city: records.CityRecord | {};
  /**
   * The location for the requested IP address.
   */
  public readonly location: records.LocationRecord | {};
  /**
   * The postal object for the requested IP address.
   */
  public readonly postal: records.PostalRecord | {};
  /**
   * An array of SubdivisionsRecord objects representing the country subdivisions for
   * the requested IP address. The number and type of subdivisions varies by
   * country, but a subdivision is typically a state, province, county, etc.
   * Subdivisions are ordered from most general (largest) to most specific
   * (smallest). If the response did not contain any subdivisions, this method
   * returns an empty array.
   */
  public readonly subdivisions: records.SubdivisionsRecord[] | [];

  /**
   * Instanstiates a "City" using fields from the response
   *
   * @param response The GeoIP2 response
   */
  public constructor(response: CityResponse) {
    super(response);

    const camelcaseResponse = (camelcaseKeys(response as Json, {
      deep: true,
      exclude: [/\-/],
    }) as unknown) as City;

    this.city = camelcaseResponse.city || {};
    this.location = camelcaseResponse.location || {};
    this.postal = camelcaseResponse.postal || {};
    this.subdivisions = camelcaseResponse.subdivisions || [];
  }
}
