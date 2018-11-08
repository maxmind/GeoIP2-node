/* tslint:disable:max-classes-per-file */

import mmdb = require('maxmind');
import { CityResponse, CountryResponse, MaxMindRecord } from './types';

/** Class representing the model of a "Country" response **/
export class Country {
  public readonly continent: mmdb.ContinentRecord | {};
  public readonly country: mmdb.CountryRecord | {};
  public readonly maxmind: MaxMindRecord | {};
  public readonly registered_country: mmdb.RegisteredCountryRecord | {};
  public readonly represented_country: mmdb.RepresentedCountryRecord | {};
  public readonly traits: mmdb.TraitsRecord;

  /**
   * Instanstiates a "Country" using fields from the response
   *
   * @param response The GeoIP2 response
   */
  public constructor(response: CountryResponse) {
    this.continent = response.continent || {};
    this.country = response.country || {};
    this.maxmind = response.maxmind || {};
    this.registered_country = response.registered_country || {};
    this.represented_country = response.represented_country || {};
    this.traits = response.traits as mmdb.TraitsRecord;
  }
}

/** Class representing the model of a "City" response **/
export class City extends Country {
  public readonly city: mmdb.CityRecord | {};
  public readonly location: mmdb.LocationRecord | {};
  public readonly postal: mmdb.PostalRecord | {};
  public readonly subdivisions: mmdb.SubdivisionsRecord[] | [];

  /**
   * Instanstiates a "City" using fields from the response
   *
   * @param response The GeoIP2 response
   */
  public constructor(response: CityResponse) {
    super(response);
    this.city = response.city || {};
    this.location = response.location || {};
    this.postal = response.postal || {};
    this.subdivisions = response.subdivisions || [];
  }
}

/** Class representing the model of a "ASN" response **/
export class Asn {
  public readonly autonomous_system_number: number | undefined;
  public readonly autonomous_system_organization: string | undefined;
  public ip_address: string | undefined;

  /**
   * Instanstiates an "Asn" using fields from the response
   *
   * @param response The GeoLite2 response
   */
  public constructor(response: mmdb.AsnResponse) {
    this.autonomous_system_number =
      response.autonomous_system_number || undefined;
    this.autonomous_system_organization =
      response.autonomous_system_organization || undefined;
    this.ip_address = response.ip_address || undefined;
  }
}
