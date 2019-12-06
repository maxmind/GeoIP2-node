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

export interface MaxMindRecord {
  queriesRemaining: number;
}

export interface CityRecord {
  readonly confidence?: number;
  readonly geonameId: number;
  readonly names: Names;
}

export interface ContinentRecord {
  readonly code: 'AF' | 'AN' | 'AS' | 'EU' | 'NA' | 'OC' | 'SA';
  readonly geonameId: number;
  readonly names: Names;
}

export interface RegisteredCountryRecord {
  readonly geonameId: number;
  readonly isInEuropeanUnion?: boolean;
  readonly isoCode: string;
  readonly names: Names;
}

export interface CountryRecord extends RegisteredCountryRecord {
  readonly confidence?: number;
}

export interface LocationRecord {
  readonly accuracyRadius: number;
  readonly averageIncome?: number;
  readonly latitude: number;
  readonly longitude: number;
  readonly metroCode?: number;
  readonly populationDensity?: number;
  readonly timeZone?: string;
}

export interface PostalRecord {
  readonly code: string;
  readonly confidence?: number;
}

export interface RepresentedCountryRecord extends RegisteredCountryRecord {
  readonly type: string;
}

export interface SubdivisionsRecord {
  readonly confidence?: number;
  readonly geonameId: number;
  readonly isoCode: string;
  readonly names: Names;
}

export interface TraitsRecord {
  readonly autonomousSystemNumber?: number;
  readonly autonomousSystemOrganization?: string;
  readonly domain?: string;
  ipAddress?: string;
  readonly isAnonymous?: boolean;
  readonly isAnonymousProxy?: boolean;
  readonly isAnonymousVpn?: boolean;
  readonly isHostingProvider?: boolean;
  readonly isLegitimateProxy?: boolean;
  readonly isPublicProxy?: boolean;
  readonly isSatelliteProvider?: boolean;
  readonly isTorExitNode?: boolean;
  readonly isp?: string;
  readonly organization?: string;
  readonly userCount?: number;
  readonly userType?:
    | 'business'
    | 'cafe'
    | 'cellular'
    | 'college'
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
