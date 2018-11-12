import mmdb = require('maxmind');
import Asn from './Asn';

export default class Isp extends Asn {
  public readonly isp: string;
  public readonly organization: string;

  /**
   * Instanstiates an "Isp" using fields from the response
   *
   * @param response The GeoLite2 response
   */
  public constructor(response: mmdb.IspResponse) {
    super(response);
    this.isp = response.isp;
    this.organization = response.organization;
  }
}
