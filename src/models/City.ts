import { camelcaseKeys } from '../utils';
import * as records from '../records';
import { CityResponse, Json } from '../types';
import Country from './Country';

/** Class representing the model of a "City" response **/
export default class City extends Country {
  /**
   * The city for the requested IP address.
   */
  public readonly city?: records.CityRecord;
  /**
   * The location for the requested IP address.
   */
  public readonly location?: records.LocationRecord;
  /**
   * The postal object for the requested IP address.
   */
  public readonly postal?: records.PostalRecord;
  /**
   * An array of SubdivisionsRecord objects representing the country subdivisions for
   * the requested IP address. The number and type of subdivisions varies by
   * country, but a subdivision is typically a state, province, county, etc.
   * Subdivisions are ordered from most general (largest) to most specific
   * (smallest). If the response did not contain any subdivisions, this method
   * returns an empty array.
   */
  public readonly subdivisions?: records.SubdivisionsRecord[];

  /**
   * Instantiates a "City" using fields from the response
   *
   * @param response The GeoIP2 response
   */
  public constructor(
    response: CityResponse,
    ipAddress?: string,
    network?: string
  ) {
    super(response, ipAddress, network);

    const camelcaseResponse = camelcaseKeys(
      response as Json
    ) as unknown as City;

    this.city = camelcaseResponse.city || undefined;
    this.location = camelcaseResponse.location || undefined;
    this.postal = camelcaseResponse.postal || undefined;
    this.subdivisions = camelcaseResponse.subdivisions || undefined;
  }
}
