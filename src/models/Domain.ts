import { DomainResponse } from 'maxmind';

/** Class representing the model of a "Domain" response **/
export default class Domain {
  /**
   * The second level domain associated with the IP address. This will be
   * something like "example.com" or "example.co.uk", not "foo.example.com".
   */
  public readonly domain?: string;
  /**
   * The IP address that the data in the model is for. If you performed a "me"
   * lookup against the web service, this will be the externally routable IP
   * address for the system the code is running on. If the system is behind a
   * NAT, this may differ from the IP address locally assigned to it.
   */
  public ipAddress?: string;
  /**
   * The network associated with the record. In particular, this is the largest
   * network where all of the fields besides ipAddress have the same value.
   */
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
