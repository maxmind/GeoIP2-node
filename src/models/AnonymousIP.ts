import mmdb = require('maxmind');

/** Class representing the model of an "AnonymousIP" response **/
export default class AnonymousIP {
  /**
   * The IP address that the data in the model is for. If you performed a "me"
   * lookup against the web service, this will be the externally routable IP
   * address for the system the code is running on. If the system is behind a
   * NAT, this may differ from the IP address locally assigned to it.
   */
  public ipAddress?: string;
  /**
   * `true if the IP address belongs to any sort of anonymous network.
   */
  public readonly isAnonymous?: boolean;
  /**
   * `true` if the IP address is registered to an anonymous VPN provider.
   */
  public readonly isAnonymousVpn?: boolean;
  /**
   * `true` if the IP address belongs to a hosting or VPN provider (see
   * description of `isAnonymousVpn` property).
   */
  public readonly isHostingProvider?: boolean;
  /**
   * `true` if the IP address belongs to a public proxy.
   */
  public readonly isPublicProxy?: boolean;
  /**
   * `true` if IP is a Tor exit node.
   */
  public readonly isTorExitNode?: boolean;
  /**
   * The network associated with the record. In particular, this is the largest
   * network where all of the fields besides `ipAddress` have the same value.
   */
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
