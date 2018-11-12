import mmdb = require('maxmind');

/** Class representing the model of an "AnonymousIP" response **/
export default class AnonymousIP {
  public ip_address?: string;
  public readonly is_anonymous?: boolean;
  public readonly is_anonymous_vpn?: boolean;
  public readonly is_hosting_provider?: boolean;
  public readonly is_public_proxy?: boolean;
  public readonly is_tor_exit_node?: boolean;

  /**
   * Instanstiates an "AnonymousIP" using fields from the response
   *
   * @param response The GeoIP2 response
   */
  public constructor(response: mmdb.AnonymousIPResponse) {
    this.ip_address = response.ip_address;
    this.is_anonymous = !!response.is_anonymous;
    this.is_anonymous_vpn = !!response.is_anonymous_vpn;
    this.is_hosting_provider = !!response.is_hosting_provider;
    this.is_public_proxy = !!response.is_public_proxy;
    this.is_tor_exit_node = !!response.is_tor_exit_node;
  }
}
