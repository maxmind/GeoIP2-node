import mmdb = require('maxmind');

/** Class representing the model of an "AnonymousIP" response **/
export default class AnonymousIP {
  public ipAddress?: string;
  public readonly isAnonymous?: boolean;
  public readonly isAnonymousVpn?: boolean;
  public readonly isHostingProvider?: boolean;
  public readonly isPublicProxy?: boolean;
  public readonly isTorExitNode?: boolean;
  public network?: string;

  /**
   * Instanstiates an "AnonymousIP" using fields from the response
   *
   * @param response The GeoIP2 response
   */
  public constructor(response: mmdb.AnonymousIPResponse) {
    this.ipAddress = response.ip_address;
    this.isAnonymous = !!response.is_anonymous;
    this.isAnonymousVpn = !!response.is_anonymous_vpn;
    this.isHostingProvider = !!response.is_hosting_provider;
    this.isPublicProxy = !!response.is_public_proxy;
    this.isTorExitNode = !!response.is_tor_exit_node;
  }
}
