import { CityResponse } from '../types';
import City from './City';

/** Class representing the model of an "Enterprise" response **/
export default class Enterprise extends City {
  /**
   * Instanstiates an "Enterprise" using fields from the response
   *
   * @param response The GeoIP2 response
   */
  public constructor(response: CityResponse) {
    super(response);
  }
}
