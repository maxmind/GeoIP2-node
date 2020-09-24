import mmdb = require('maxmind');
import Asn from './Asn';

export default class Isp extends Asn {
  /**
   * The name of the ISP associated with the IP address.
   */
  public readonly isp: string;
  /**
   * The name of the organization associated with the IP address.
   */
  public readonly organization: string;

  /**
   * Instantiates an "Isp" using fields from the response
   *
   * @param response The GeoLite2 response
   */
  public constructor(response: mmdb.IspResponse) {
    super(response);
    this.isp = response.isp;
    this.organization = response.organization;
  }
}
