import * as mmdb from 'maxmind';
import AnonymousIP from './AnonymousIP';

/** Class representing the model of an "AnonymousPlus" response **/
export default class AnonymousPlus extends AnonymousIP {
  /**
   * A score ranging from 1 to 99 that is our percent confidence that the
   * network is currently part of an actively used VPN service.
   */
  public anonymizerConfidence?: number;
  /**
   * The last day that the network was sighted in our analysis of anonymized
   * networks. This is in the ISO 8601 date format, e.g., "2025-04-21".
   */
  public networkLastSeen?: string;
  /**
   * The name of the VPN provider (e.g., NordVPN, SurfShark, etc.) associated
   * with the network.
   */
  public providerName?: string;

  /**
   * Instantiates an "AnonymousPlus" using fields from the response
   *
   * @param response The GeoIP2 response
   */
  public constructor(
    response: mmdb.AnonymousPlusResponse,
    ipAddress?: string,
    network?: string
  ) {
    super(response, ipAddress, network);

    this.anonymizerConfidence = response.anonymizer_confidence;
    this.networkLastSeen = response.network_last_seen;
    this.providerName = response.provider_name;
  }
}
