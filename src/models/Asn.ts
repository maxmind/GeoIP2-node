import mmdb = require('maxmind');

/** Class representing the model of an "ASN" response **/
export default class Asn {
  public readonly autonomous_system_number?: number;
  public readonly autonomous_system_organization?: string;
  public ip_address?: string;

  /**
   * Instanstiates an "Asn" using fields from the response
   *
   * @param response The GeoLite2 response
   */
  public constructor(response: mmdb.AsnResponse) {
    this.autonomous_system_number =
      response.autonomous_system_number || undefined;
    this.autonomous_system_organization =
      response.autonomous_system_organization || undefined;
    this.ip_address = response.ip_address;
  }
}
