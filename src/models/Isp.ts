import * as mmdb from 'maxmind';
import Asn from './Asn';

export default class Isp extends Asn {
  /**
   * The name of the ISP associated with the IP address.
   */
  public readonly isp: string;
  /**
   * The mobile country code (MCC) associated with the IP address and ISP.
   * See https://en.wikipedia.org/wiki/Mobile_country_code.
   */
  public readonly mobileCountryCode?: string;
  /**
   * The mobile network code (MNC) associated with the IP address and ISP.
   * See https://en.wikipedia.org/wiki/Mobile_country_code.
   */
  public readonly mobileNetworkCode?: string;
  /**
   * The name of the organization associated with the IP address.
   */
  public readonly organization: string;

  /**
   * Instantiates an "Isp" using fields from the response
   *
   * @param response The GeoIP2-ISP response
   */
  public constructor(
    response: mmdb.IspResponse,
    ipAddress?: string,
    network?: string
  ) {
    super(response, ipAddress, network);
    this.isp = response.isp;
    this.mobileCountryCode = response.mobile_country_code;
    this.mobileNetworkCode = response.mobile_network_code;
    this.organization = response.organization;
  }
}
