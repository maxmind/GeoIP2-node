import mmdb = require('maxmind');

/** Class representing the model of a "ConnectionType" response **/
export default class ConnectionType {
  /**
   * The connection type may take the following values:
   * "Dialup", "Cable/DSL", "Corporate", "Cellular".
   * Additional values may be added in the future.
   */
  public readonly connectionType: string;
  public ipAddress?: string;
  public network?: string;

  /**
   * Instanstiates a "ConnectionType" using fields from the response
   *
   * @param response The GeoIP2 response
   */
  public constructor(response: mmdb.ConnectionTypeResponse) {
    this.connectionType = response.connection_type;
    this.ipAddress = response.ip_address;
  }
}
