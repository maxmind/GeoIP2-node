import { ConnectionType } from './types';

/**
 * The name of the place based on the locales list passed to the
 * `WebServiceClient` constructor. Don't use any of these names as a database or
 * dictionary key. Use the ID or relevant code instead.
 */
export interface Names {
  readonly de?: string;
  readonly en: string;
  readonly es?: string;
  readonly fr?: string;
  readonly ja?: string;
  readonly 'pt-BR'?: string;
  readonly ru?: string;
  readonly 'zh-CN'?: string;
}

/**
 * Contains data related to your MaxMind account.
 */
export interface MaxMindRecord {
  /**
   * The number of remaining queries in your account for the web service end
   * point. This will be null when using a local database.
   */
  queriesRemaining: number;
}

/**
 * City-level data associated with an IP address.
 */
export interface CityRecord {
  /**
   * A value from 0-100 indicating MaxMind's confidence that the city is
   * correct. This value is only set when using the Insights web service or the
   * Enterprise database.
   */
  readonly confidence?: number;
  /**
   * The GeoName ID for the city.
   */
  readonly geonameId: number;
  /**
   * An object of locale codes to the name in that locale. Don't use any of
   * these names as a database or dictionary key. Use the ID or relevant code
   * instead.
   */
  readonly names: Names;
}

/**
 * Contains data for the continent record associated with an IP address. Do not
 * use any of the continent names as a database or dictionary key. Use the ID or
 * relevant code instead.
 */
export interface ContinentRecord {
  /**
   * A two character continent code like "NA" (North America) or "OC" (Oceania).
   */
  readonly code: 'AF' | 'AN' | 'AS' | 'EU' | 'NA' | 'OC' | 'SA';
  /**
   * The GeoName ID for the continent.
   */
  readonly geonameId: number;
  /**
   * An object of locale codes to the name in that locale. Don't use any of
   * these names as a database or dictionary key. Use the ID or relevant code
   * instead.
   */
  readonly names: Names;
}

/**
 * Contains data for the registered country record associated with an IP address. Do not
 * use any of the country names as a database or dictionary key. Use the ID or
 * relevant code instead.
 */
export interface RegisteredCountryRecord {
  /**
   * The GeoName ID for the country.
   */
  readonly geonameId: number;
  /**
   * This is true if the country is a member state of the European Union. This is available from all location services and databases.
   */
  readonly isInEuropeanUnion: boolean;
  /**
   * The two-character ISO 3166-1 alpha code for the country.
   */
  readonly isoCode: string;
  /**
   * An object of locale codes to the name in that locale. Don't use any of
   * these names as a database or dictionary key. Use the ID or relevant code
   * instead.
   */
  readonly names: Names;
}

/**
 * Contains data for the country record associated with an IP address. Do not
 * use any of the country names as a database or dictionary key. Use the ID or
 * relevant code instead.
 */
export interface CountryRecord extends RegisteredCountryRecord {
  /**
   * A value from 0-100 indicating MaxMind's confidence that the country is
   * correct. This value is only set when using the Insights web service or the
   * Enterprise database.
   */
  readonly confidence?: number;
}

/**
 * Contains data for the location record associated with an IP address.
 */
export interface LocationRecord {
  /**
   * The approximate accuracy radius in kilometers around the latitude and
   * longitude for the IP address. This is the radius where we have a 67%
   * confidence that the device using the IP address resides within the circle
   * centered at the latitude and longitude with the provided radius.
   */
  readonly accuracyRadius: number;
  /**
   * The average income in US dollars associated with the IP address.
   */
  readonly averageIncome?: number;
  /**
   * The approximate latitude of the location associated with the IP address.
   * This value is not precise and should not be used to identify a particular
   * address or household.
   */
  readonly latitude: number;
  /**
   * The approximate longitude of the location associated with the IP address.
   * This value is not precise and should not be used to identify a particular
   * address or household.
   */
  readonly longitude: number;
  /**
   * The metro code is a no-longer-maintained code for targeting
   * advertisements in Google.
   * @category deprecated
   * @deprecated
   */
  readonly metroCode?: number;
  /**
   * The estimated number of people per square kilometer.
   */
  readonly populationDensity?: number;
  /**
   * The time zone associated with location, as specified by the IANA Time Zone
   * Database , e.g., "America/New_York".
   */
  readonly timeZone?: string;
}

/**
 * Contains data for the postal record associated with an IP address.
 */
export interface PostalRecord {
  /**
   * The postal code of the location. Postal codes are not available for all
   * countries. In some countries, this will only contain part of the postal
   * code.
   */
  readonly code: string;
  /**
   * A value from 0-100 indicating MaxMind's confidence that the postal code is
   * correct. This value is only set when using the Insights web service or the
   * Enterprise database.
   */
  readonly confidence?: number;
}

/**
 * Contains data for the represented country associated with an IP address.
 * This class contains the country-level data associated with an IP address for
 * the IP's represented country. The represented country is the country
 * represented by something like a military base. Do not use any of the country
 * names as a database or dictionary key. Use the ID or relevant instead.
 */
export interface RepresentedCountryRecord extends RegisteredCountryRecord {
  /**
   * A string indicating the type of entity that is representing the country.
   * Currently we only return military but this could expand to include other
   * types in the future.
   */
  readonly type: string;
}

/**
 * Contains data for the subdivisions associated with an IP address. Do not use
 * any of the subdivision names as a database or dictionary key. Use the ID or
 * relevant instead.
 */
export interface SubdivisionsRecord {
  /**
   * This is a value from 0-100 indicating MaxMind's confidence that the
   * subdivision is correct. This value is only set when using the Insights web
   * service or the Enterprise database.
   */
  readonly confidence?: number;
  /**
   * The GeoName ID for the subdivision.
   */
  readonly geonameId: number;
  /**
   * This is a string up to three characters long contain the subdivision portion of the code.
   */
  readonly isoCode: string;
  /**
   * An object of locale codes to the name in that locale. Don't use any of
   * these names as a database or dictionary key. Use the ID or relevant code
   * instead.
   */
  readonly names: Names;
}

/**
 * Contains data for the traits record associated with an IP address.
 */
export interface TraitsRecord {
  /**
   * The autonomous system number associated with the IP address. This value is
   * only set when using the City Plus or Insights web service or the
   * Enterprise database.
   */
  readonly autonomousSystemNumber?: number;
  /**
   * The organization associated with the registered autonomous system number
   * for the IP address. This value is only set when using the City Plus or
   * Insights web service or the Enterprise database.
   */
  readonly autonomousSystemOrganization?: string;
  /**
   * The connection type may take the following values:
   * "Dialup", "Cable/DSL", "Corporate", "Cellular", and "Satellite".
   * Additional values may be added in the future. This value is only set when
   * using the City Plus or Insights web service or the Enterprise database.
   */
  readonly connectionType?: ConnectionType;
  /**
   * The second level domain associated with the IP address. This will be
   * something like "example.com" or "example.co.uk", not "foo.example.com".
   * This value is only set when using the City Plus or Insights web service or
   * the Enterprise database.
   */
  readonly domain?: string;
  /**
   * The IP address that the data in the model is for. If you performed a "me"
   * lookup against the web service, this will be the externally routable IP
   * address for the system the code is running on. If the system is behind a
   * NAT, this may differ from the IP address locally assigned to it.
   */
  ipAddress?: string;
  /**
   * This is true if the IP address belongs to any sort of anonymous network.
   * This value is only available from GeoIP2 Insights.
   */
  readonly isAnonymous: boolean;
  /**
   * This is true if the IP is an anonymous proxy. See MaxMind's GeoIP FAQ
   * @category deprecated
   * @deprecated
   */
  readonly isAnonymousProxy: boolean;
  /**
   * This is true if the IP address is registered to an anonymous VPN provider.
   * This value is only available from GeoIP2 Insights.
   */
  readonly isAnonymousVpn: boolean;
  /**
   * This is true if the IP address belongs to an anycast network.
   * See https://en.wikipedia.org/wiki/Anycast.
   *
   * This is not available from GeoLite databases or web services.
   */
  readonly isAnycast: boolean;
  /**
   * This is true if the IP address belongs to a hosting or VPN provider (see
   * description of `IsAnonymousVpn` property). This value is only available from
   * GeoIP2 Insights.
   */
  readonly isHostingProvider: boolean;
  /**
   * True if MaxMind believes this IP address to be a legitimate proxy, such as
   * an internal VPN used by a corporation. This is only available in the
   * GeoIP2 Enterprise database.
   */
  readonly isLegitimateProxy: boolean;
  /**
   * This is true if the IP address belongs to a public proxy. This value is
   * only available from GeoIP2 Insights.
   */
  readonly isPublicProxy: boolean;
  /**
   * This is true if the IP address is on a suspected anonymizing network and
   * belongs to a residential ISP. This value is only available from GeoIP2
   * Insights.
   */
  readonly isResidentialProxy: boolean;
  /**
   * This is true if the IP belong to a satellite Internet provider.
   * @category deprecated
   * @deprecated
   */
  readonly isSatelliteProvider: boolean;
  /**
   * This is true if the IP address belongs to a Tor exit node. This value is
   * only available from GeoIP2 Insights.
   */
  readonly isTorExitNode: boolean;
  /**
   * The network associated with the record. In particular, this is the largest
   * network where all of the fields besides `ipAddress` have the same value.
   */
  network?: string;
  /**
   * The name of the ISP associated with the IP address. This value is only set
   * when using the City Plus or Insights web service or the Enterprise
   * database.
   */
  readonly isp?: string;
  /**
   * The mobile country code (MCC) associated with the IP address and ISP.
   * See https://en.wikipedia.org/wiki/Mobile_country_code.
   *
   * This value is only set when using the City Plus or Insights web service or
   * the Enterprise database.
   */
  readonly mobileCountryCode?: string;
  /**
   * The mobile network code (MNC) associated with the IP address and ISP.
   * See https://en.wikipedia.org/wiki/Mobile_country_code.
   *
   * This value is only set when using the City Plus or Insights web service or
   * the Enterprise database.
   */
  readonly mobileNetworkCode?: string;
  /**
   * The name of the organization associated with the IP address. This value is
   * only set when using the City Plus or Insights web service or the
   * Enterprise database.
   */
  readonly organization?: string;
  /**
   * An indicator of how static or dynamic an IP address is. The value ranges
   * from 0 to 99.99 with higher values meaning a greater static association.
   * For example, many IP addresses with a `userType` of `cellular` have a lifetime
   * under one. Static Cable/DSL IPs typically have a lifetime above thirty.
   */
  readonly staticIpScore?: number;
  /**
   * The estimated number of users sharing the IP/network during the past 24
   * hours. For IPv4, the count is for the individual IP. For IPv6, the count
   * is for the /64 network. This value is only available from GeoIP2 Insights.
   */
  readonly userCount?: number;
  /**
   * The user type associated with the IP address. This value is only set when
   * using the City Plus or Insights web service or the Enterprise database.
   */
  readonly userType?:
    | 'business'
    | 'cafe'
    | 'cellular'
    | 'college'
    | 'consumer_privacy_network'
    | 'content_delivery_network'
    | 'dialup'
    | 'government'
    | 'hosting'
    | 'library'
    | 'military'
    | 'residential'
    | 'router'
    | 'school'
    | 'search_engine_spider'
    | 'traveler';
}
