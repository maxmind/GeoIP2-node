import { DomainResponse } from 'maxmind';

/** Class representing the model of a "Domain" response **/
export default class Domain {
  public readonly domain?: string;
  public ipAddress?: string;
  public network?: string;

  /**
   * Instanstiates an "Domain" using fields from the response
   *
   * @param response The GeoIP2 response
   */
  public constructor(response: DomainResponse) {
    this.domain = response.domain;
    this.ipAddress = response.ip_address;
  }
}
