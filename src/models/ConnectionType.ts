import * as mmdb from 'maxmind';
import { ConnectionType as ConnType } from '../types';

/** Class representing the model of a "ConnectionType" response **/
export default class ConnectionType {
  /**
   * The connection type may take the following values:
   * "Dialup", "Cable/DSL", "Corporate", "Cellular", and "Satellite".
   * Additional values may be added in the future.
   */
  public readonly connectionType: ConnType;
  /**
   * The IP address that the data in the model is for. If you performed a "me"
   * lookup against the web service, this will be the externally routable IP
   * address for the system the code is running on. If the system is behind a
   * NAT, this may differ from the IP address locally assigned to it.
   */
  public ipAddress?: string;
  /**
   * The network associated with the record. In particular, this is the largest network where all of the fields besides ipAddress have the same value.
   */
  public network?: string;

  /**
   * Instantiates a "ConnectionType" using fields from the response
   *
   * @param response The GeoIP2 response
   */
  public constructor(
    response: mmdb.ConnectionTypeResponse,
    ipAddress?: string,
    network?: string
  ) {
    this.connectionType = response.connection_type as ConnType;
    this.ipAddress = ipAddress;
    this.network = network;
  }
}
