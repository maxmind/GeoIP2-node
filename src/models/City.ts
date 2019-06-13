import camelcaseKeys = require('camelcase-keys');
import * as records from '../records';
import { CityResponse, Json } from '../types';
import Country from './Country';

/** Class representing the model of a "City" response **/
export default class City extends Country {
  public readonly city: records.CityRecord | {};
  public readonly location: records.LocationRecord | {};
  public readonly postal: records.PostalRecord | {};
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
