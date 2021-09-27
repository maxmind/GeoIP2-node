import { createCIDR } from 'ip6addr';
import set = require('lodash.set');
import * as mmdb from 'maxmind';
import { AddressNotFoundError, BadMethodCallError, ValueError } from './errors';
import * as models from './models';

/** Class representing the ReaderModel **/
export default class ReaderModel {
  private mmdbReader: mmdb.Reader<mmdb.Response>;

  /**
   * Instantiates a ReaderModel using node-maxmind reader
   *
   * @param mmdbReader The mmdbReader
   */
  public constructor(mmdbReader: mmdb.Reader<mmdb.Response>) {
    this.mmdbReader = mmdbReader;
  }

  /**
   * Returns the AnonymousIP db data for an IP address
   *
   * @param ipAddress The IP Address you want to query the Anonymous IP db with
   *
   * @throws {BadMethodCallError} Throws an error when the DB doesn't support Anonymous IP queries
   * @throws {AddressNotFoundError} Throws an error when the IP address isn't found in the database
   * @throws {ValueError} Throws an error when the IP address isn't valid
   */
  public anonymousIP(ipAddress: string): models.AnonymousIP {
    return this.modelFor(
      models.AnonymousIP,
      'GeoIP2-Anonymous-IP',
      ipAddress,
      'anonymousIP()'
    );
  }

  /**
   * Returns the City db data for an IP address
   *
   * @param ipAddress The IP Address you want to query the City db with
   *
   * @throws {BadMethodCallError} Throws an error when the DB doesn't support City queries
   * @throws {AddressNotFoundError} Throws an error when the IP address isn't found in the database
   * @throws {ValueError} Throws an error when the IP address isn't valid
   */
  public city(ipAddress: string): models.City {
    return this.modelFor(models.City, 'City', ipAddress, 'city()');
  }

  /**
   * Returns the Country db data for an IP address
   *
   * @param ipAddress The IP Address you want to query the Country db with
   *
   * @throws {BadMethodCallError} Throws an error when the DB doesn't support City queries
   * @throws {AddressNotFoundError} Throws an error when the IP address isn't found in the database
   * @throws {ValueError} Throws an error when the IP address isn't valid
   */
  public country(ipAddress: string): models.Country {
    return this.modelFor(models.Country, 'Country', ipAddress, 'country()');
  }

  /**
   * Returns the ASN db data for an IP address
   *
   * @param ipAddress The IP Address you want to query the ASN db with
   *
   * @throws {BadMethodCallError} Throws an error when the DB doesn't support ASN queries
   * @throws {AddressNotFoundError} Throws an error when the IP address isn't found in the database
   * @throws {ValueError} Throws an error when the IP address isn't valid
   */
  public asn(ipAddress: string): models.Asn {
    return this.modelFor(models.Asn, 'ASN', ipAddress, 'asn()');
  }

  /**
   * Returns the Connection-Type db data for an IP address
   *
   * @param ipAddress The IP Address you want to query the Connection-Type db with
   *
   * @throws {BadMethodCallError} Throws an error when the DB doesn't support Connection-Type queries
   * @throws {AddressNotFoundError} Throws an error when the IP address isn't found in the database
   * @throws {ValueError} Throws an error when the IP address isn't valid
   */
  public connectionType(ipAddress: string): models.ConnectionType {
    return this.modelFor(
      models.ConnectionType,
      'Connection-Type',
      ipAddress,
      'connectionType()'
    );
  }

  /**
   * Returns the Domain db data for an IP address
   *
   * @param ipAddress The IP Address you want to query the Domain db with
   *
   * @throws {BadMethodCallError} Throws an error when the DB doesn't support Domain queries
   * @throws {AddressNotFoundError} Throws an error when the IP address isn't found in the database
   * @throws {ValueError} Throws an error when the IP address isn't valid
   */
  public domain(ipAddress: string): models.Domain {
    return this.modelFor(models.Domain, 'Domain', ipAddress, 'domain()');
  }

  /**
   * Returns the ISP db data for an IP address
   *
   * @param ipAddress The IP Address you want to query the ISP db with
   *
   * @throws {BadMethodCallError} Throws an error when the DB doesn't support ISP queries
   * @throws {AddressNotFoundError} Throws an error when the IP address isn't found in the database
   * @throws {ValueError} Throws an error when the IP address isn't valid
   */
  public isp(ipAddress: string): models.Isp {
    return this.modelFor(models.Isp, 'ISP', ipAddress, 'isp()');
  }

  /**
   * Returns the Enterprise db data for an IP address
   *
   * @param ipAddress The IP Address you want to query the Enterprise db with
   *
   * @throws {BadMethodCallError} Throws an error when the DB doesn't support Enterprise queries
   * @throws {AddressNotFoundError} Throws an error when the IP address isn't found in the database
   * @throws {ValueError} Throws an error when the IP address isn't valid
   */
  public enterprise(ipAddress: string): models.City {
    return this.modelFor(
      models.Enterprise,
      'Enterprise',
      ipAddress,
      'enterprise()'
    );
  }

  private getResponse(
    dbType: string,
    ipAddress: string,
    fnName: string
  ): [mmdb.Response, string] {
    const metaDbType = this.mmdbReader.metadata.databaseType;

    if (!mmdb.validate(ipAddress)) {
      throw new ValueError(`${ipAddress} is invalid`);
    }

    if (!metaDbType.includes(dbType)) {
      throw new BadMethodCallError(
        `The ${fnName} method cannot be used with the ${metaDbType} database`
      );
    }

    const [response, prefixLength] =
      this.mmdbReader.getWithPrefixLength(ipAddress);

    if (!response) {
      throw new AddressNotFoundError(
        `The address ${ipAddress} is not in the database`
      );
    }

    const CIDR = createCIDR(ipAddress, prefixLength);

    return [response, CIDR.toString()];
  }

  private modelFor<T1 extends mmdb.Response, T2>(
    modelClass: new (response: T1) => T2,
    dbType: string,
    ipAddress: string,
    fnName: string
  ) {
    const [response, network] = this.getResponse(dbType, ipAddress, fnName);

    const model: T2 = new modelClass(response as T1);

    switch (dbType) {
      case 'ASN':
      case 'Connection-Type':
      case 'Domain':
      case 'GeoIP2-Anonymous-IP':
      case 'ISP':
        set(model as any, 'ipAddress', ipAddress);
        set(model as any, 'network', network);
        break;
      default:
        set(model as any, 'traits.ipAddress', ipAddress);
        set(model as any, 'traits.network', network);
    }

    return model;
  }
}
