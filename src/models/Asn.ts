import mmdb = require('maxmind');

/** Class representing the model of an "ASN" response **/
export default class Asn {
  public readonly autonomousSystemNumber?: number;
  public readonly autonomousSystemOrganization?: string;
  public ipAddress?: string;
  public network?: string;

  /**
   * Instanstiates an "Asn" using fields from the response
   *
   * @param response The GeoLite2 response
   */
  public constructor(response: mmdb.AsnResponse) {
    this.autonomousSystemNumber = response.autonomous_system_number;
    this.autonomousSystemOrganization = response.autonomous_system_organization;
    this.ipAddress = response.ip_address;
  }
}
