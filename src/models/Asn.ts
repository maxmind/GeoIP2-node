import mmdb = require('maxmind');

/** Class representing the model of an "ASN" response **/
export default class Asn {
  /**
   * The autonomous system number associated with the IP address
   */
  public readonly autonomousSystemNumber?: number;
  /**
   * The organization associated with the registered autonomous system number
   * for the IP address.
   */
  public readonly autonomousSystemOrganization?: string;
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
   * Instantiates an "Asn" using fields from the response
   *
   * @param response The GeoLite2 response
   */
  public constructor(response: mmdb.AsnResponse) {
    this.autonomousSystemNumber = response.autonomous_system_number;
    this.autonomousSystemOrganization = response.autonomous_system_organization;
    this.ipAddress = response.ip_address;
  }
}
