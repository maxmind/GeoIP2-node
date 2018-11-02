import set = require('lodash.set');
import mmdb = require('maxmind');
import { AddressNotFoundError, BadMethodCallError } from './errors';
import * as models from './models';

/** Class representing the ReaderModel **/
export default class ReaderModel {
  private mmdbReader: mmdb.IReader;

  /**
   * Instanstiates a ReaderModel using node-maxmind reader
   *
   * @param mmdbReader The mmdbReader
   */
  public constructor(mmdbReader: mmdb.IReader) {
    this.mmdbReader = mmdbReader;
  }

  /**
   * Returns the City data for an IP address
   *
   * @param ipAddress The IP Address you want to query the City db with
   *
   * @throws {BadMethodCallError} Throws an error when the DB doesn't support City queries
   * @throws {AddressNotFoundError} Throws an error when the IP address isn't found in the database
   */
  public city(ipAddress: string) {
    return this.modelFor(models.City, 'City', ipAddress, 'city()');
  }

  private getRecord(dbType: string, ipAddress: string, fnName: string) {
    const metaDbType = this.mmdbReader.metadata.databaseType;

    if (!metaDbType.includes(dbType)) {
      throw new BadMethodCallError(
        `The ${fnName} method cannot be used with the ${metaDbType} database`
      );
    }

    const record = this.mmdbReader.get(ipAddress);

    if (!record) {
      throw new AddressNotFoundError(
        `The address ${ipAddress} is not in the database`
      );
    }

    return record;
  }

  private modelFor(
    modelClass: any,
    dbType: string,
    ipAddress: string,
    fnName: string
  ) {
    const record = this.getRecord(dbType, ipAddress, fnName);
    set(record, 'traits.ip_address', ipAddress);

    return new modelClass(record);
  }
}
