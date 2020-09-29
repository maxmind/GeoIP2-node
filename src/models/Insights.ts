import { CityResponse } from '../types';
import City from './City';

/** Class representing the model of an "Insights" response **/
export default class Insights extends City {
  /**
   * Instantiates an "Insights" using fields from the response
   *
   * @param response The GeoIP2 response
   */
  public constructor(response: CityResponse) {
    super(response);
  }
}
