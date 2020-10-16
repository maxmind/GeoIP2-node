import camelcaseKeys = require('camelcase-keys');
import { cloneDeep } from 'lodash';
import mmdb = require('maxmind');
import * as anonymousIPFixture from '../fixtures/anonymous-ip.json';
import * as connectionTypeFixture from '../fixtures/geoip2-connection-type.json';
import * as domainFixture from '../fixtures/geoip2-domain.json';
import * as ispFixture from '../fixtures/geoip2-isp.json';
import * as geoip2Fixture from '../fixtures/geoip2.json';
import * as asnFixture from '../fixtures/geolite2-asn.json';
import { AddressNotFoundError, BadMethodCallError, ValueError } from './errors';
import Reader from './reader';
import ReaderModel from './readerModel';

const ips = {
  empty: '88.88.88.88',
  invalid: 'foobar',
  notFound: '99.99.99.99',
  valid: '11.11.11.11',
};

const networks = {
  empty: '88.88.88.88/32',
  valid: '11.11.11.0/24',
};

const createMmdbReaderMock: any = (databaseType: string, fixture: any) => ({
  getWithPrefixLength(ipAddress: string) {
    if (ipAddress === ips.notFound) {
      throw new Error('ip address not found');
    }

    if (ipAddress === ips.empty) {
      return [{}, 32];
    }
    return [fixture, 24];
  },
  metadata: {
    binaryFormatMajorVersion: 1,
    binaryFormatMinorVersion: 2,
    buildEpoch: new Date(),
    databaseType,
    description: 'hello',
    ipVersion: 5,
    languages: ['en'],
    nodeByteSize: 1,
    nodeCount: 1,
    recordSize: 1,
    searchTreeSize: 1,
    treeDepth: 1,
  },
});

describe('ReaderModel', () => {
  describe('city()', () => {
    it('returns city data', async () => {
      expect.assertions(1);

      const cityInstance = await Reader.open(
        './test/data/test-data/GeoIP2-City-Test.mmdb'
      );

      const cityModel: any = cityInstance.city('2.125.160.216');

      const expected = {
        city: {
          geonameId: 2655045,
          names: {
            en: 'Boxford',
          },
        },
        continent: {
          code: 'EU',
          geonameId: 6255148,
          names: {
            de: 'Europa',
            en: 'Europe',
            es: 'Europa',
            fr: 'Europe',
            ja: 'ヨーロッパ',
            'pt-BR': 'Europa',
            ru: 'Европа',
            'zh-CN': '欧洲',
          },
        },
        country: {
          geonameId: 2635167,
          isInEuropeanUnion: true,
          isoCode: 'GB',
          names: {
            de: 'Vereinigtes Königreich',
            en: 'United Kingdom',
            es: 'Reino Unido',
            fr: 'Royaume-Uni',
            ja: 'イギリス',
            'pt-BR': 'Reino Unido',
            ru: 'Великобритания',
            'zh-CN': '英国',
          },
        },
        location: {
          accuracyRadius: 100,
          latitude: 51.75,
          longitude: -1.25,
          timeZone: 'Europe/London',
        },
        maxmind: {},
        postal: {
          code: 'OX1',
        },
        registeredCountry: {
          geonameId: 3017382,
          isInEuropeanUnion: true,
          isoCode: 'FR',
          names: {
            de: 'Frankreich',
            en: 'France',
            es: 'Francia',
            fr: 'France',
            ja: 'フランス共和国',
            'pt-BR': 'França',
            ru: 'Франция',
            'zh-CN': '法国',
          },
        },
        representedCountry: {},
        subdivisions: [
          {
            geonameId: 6269131,
            isoCode: 'ENG',
            names: {
              en: 'England',
              es: 'Inglaterra',
              fr: 'Angleterre',
              'pt-BR': 'Inglaterra',
            },
          },
          {
            geonameId: 3333217,
            isoCode: 'WBK',
            names: {
              en: 'West Berkshire',
              ru: 'Западный Беркшир',
              'zh-CN': '西伯克郡',
            },
          },
        ],
        traits: {
          isAnonymous: false,
          isAnonymousProxy: false,
          isAnonymousVpn: false,
          isHostingProvider: false,
          isLegitimateProxy: false,
          isPublicProxy: false,
          isResidentialProxy: false,
          isSatelliteProvider: false,
          isTorExitNode: false,
          ipAddress: '2.125.160.216',
          network: '2.125.160.216/29',
        },
      };

      expect(cityModel).toEqual(expected);
    });

    it('throws an error if IP address is not valid', async () => {
      expect.assertions(1);

      const cityInstance = await Reader.open(
        './test/data/test-data/GeoIP2-City-Test.mmdb'
      );

      expect(() => cityInstance.city('foobar')).toThrow(ValueError);
    });

    it('throws an error if db types do not match', async () => {
      expect.assertions(1);

      const cityInstance = await Reader.open(
        './test/data/test-data/GeoIP2-City-Test.mmdb'
      );

      expect(() => cityInstance.anonymousIP('1.2.3.4')).toThrow(
        BadMethodCallError
      );
    });

    it('throws an error if IP address is not in database', async () => {
      expect.assertions(1);

      const cityInstance = await Reader.open(
        './test/data/test-data/GeoIP2-City-Test.mmdb'
      );

      expect(() => cityInstance.city('1.2.3.4')).toThrow(AddressNotFoundError);
    });
  });

  describe('country()', () => {
    it('returns country data', async () => {
      expect.assertions(1);

      const countryInstance = await Reader.open(
        './test/data/test-data/GeoIP2-Country-Test.mmdb'
      );

      const countryModel: any = countryInstance.country('2.125.160.216');

      const expected = {
        continent: {
          code: 'EU',
          geonameId: 6255148,
          names: {
            de: 'Europa',
            en: 'Europe',
            es: 'Europa',
            fr: 'Europe',
            ja: 'ヨーロッパ',
            'pt-BR': 'Europa',
            ru: 'Европа',
            'zh-CN': '欧洲',
          },
        },
        country: {
          geonameId: 2635167,
          isInEuropeanUnion: true,
          isoCode: 'GB',
          names: {
            de: 'Vereinigtes Königreich',
            en: 'United Kingdom',
            es: 'Reino Unido',
            fr: 'Royaume-Uni',
            ja: 'イギリス',
            'pt-BR': 'Reino Unido',
            ru: 'Великобритания',
            'zh-CN': '英国',
          },
        },
        maxmind: {},
        registeredCountry: {
          geonameId: 3017382,
          isInEuropeanUnion: true,
          isoCode: 'FR',
          names: {
            de: 'Frankreich',
            en: 'France',
            es: 'Francia',
            fr: 'France',
            ja: 'フランス共和国',
            'pt-BR': 'França',
            ru: 'Франция',
            'zh-CN': '法国',
          },
        },
        representedCountry: {},
        traits: {
          ipAddress: '2.125.160.216',
          isAnonymous: false,
          isAnonymousProxy: false,
          isAnonymousVpn: false,
          isHostingProvider: false,
          isLegitimateProxy: false,
          isPublicProxy: false,
          isResidentialProxy: false,
          isSatelliteProvider: false,
          isTorExitNode: false,
          network: '2.125.160.216/29',
        },
      };

      expect(countryModel).toEqual(expected);
    });

    it('throws an error if db types do not match', async () => {
      expect.assertions(1);

      const countryInstance = await Reader.open(
        './test/data/test-data/GeoIP2-Country-Test.mmdb'
      );

      expect(() => countryInstance.anonymousIP('1.2.3.4')).toThrow(
        BadMethodCallError
      );
    });

    it('throws an error if IP address is not in database', async () => {
      expect.assertions(1);

      const countryInstance = await Reader.open(
        './test/data/test-data/GeoIP2-Country-Test.mmdb'
      );

      expect(() => countryInstance.country('1.2.3.4')).toThrow(
        AddressNotFoundError
      );
    });

    it('throws an error if IP address is not valid', async () => {
      expect.assertions(1);

      const countryInstance = await Reader.open(
        './test/data/test-data/GeoIP2-Country-Test.mmdb'
      );

      expect(() => countryInstance.country('foobar')).toThrow(ValueError);
    });
  });

  describe('anonymousIP()', () => {
    it('returns anonymousIP data', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Anonymous-IP-Test.mmdb'
      );

      const model: any = reader.anonymousIP('81.2.69.1');

      const expected = {
        ipAddress: '81.2.69.1',
        isAnonymous: true,
        isAnonymousVpn: true,
        isHostingProvider: true,
        isPublicProxy: true,
        isResidentialProxy: true,
        isTorExitNode: true,
        network: '81.2.69.0/24',
      };

      expect(model).toEqual(expected);
    });

    it('throws an error if db types do not match', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Anonymous-IP-Test.mmdb'
      );

      expect(() => reader.city('1.2.3.4')).toThrow(BadMethodCallError);
    });

    it('throws an error if IP address is not in database', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Anonymous-IP-Test.mmdb'
      );

      expect(() => reader.anonymousIP('255.2.3.4')).toThrow(
        AddressNotFoundError
      );
    });

    it('throws an error if IP address is not valid', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Anonymous-IP-Test.mmdb'
      );

      expect(() => reader.anonymousIP('foobar')).toThrow(ValueError);
    });

    it('returns false for undefined values', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Anonymous-IP-Test.mmdb'
      );

      const model: any = reader.anonymousIP('2.125.160.216');

      const expected = {
        ipAddress: '2.125.160.216',
        isAnonymous: false,
        isAnonymousVpn: false,
        isHostingProvider: false,
        isPublicProxy: false,
        isResidentialProxy: false,
        isTorExitNode: false,
        network: '2.0.0.0/7',
      };

      expect(model).toEqual(expected);
    });
  });

  describe('asn()', () => {
    it('returns asn data', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoLite2-ASN-Test.mmdb'
      );

      const model: any = reader.asn('1.128.0.1');

      const expected = {
        autonomousSystemNumber: 1221,
        autonomousSystemOrganization: 'Telstra Pty Ltd',
        ipAddress: '1.128.0.1',
        network: '1.128.0.0/11',
      };

      expect(model).toEqual(expected);
    });

    it('throws an error if db types do not match', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoLite2-ASN-Test.mmdb'
      );

      expect(() => reader.city('1.2.3.4')).toThrow(BadMethodCallError);
    });

    it('throws an error if IP address is not in database', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoLite2-ASN-Test.mmdb'
      );

      expect(() => reader.asn('1.2.3.4')).toThrow(AddressNotFoundError);
    });

    it('throws an error if IP address is not valid', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoLite2-ASN-Test.mmdb'
      );

      expect(() => reader.asn('foobar')).toThrow(ValueError);
    });
  });

  describe('connectionType()', () => {
    it('returns connection-type data', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Connection-Type-Test.mmdb'
      );

      const model: any = reader.connectionType('1.0.0.1');

      const expected = {
        connectionType: 'Dialup',
        ipAddress: '1.0.0.1',
        network: '1.0.0.0/24',
      };

      expect(model).toEqual(expected);
    });

    it('throws an error if db types do not match', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Connection-Type-Test.mmdb'
      );

      expect(() => reader.city('1.2.3.4')).toThrow(BadMethodCallError);
    });

    it('throws an error if IP address is not in database', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Connection-Type-Test.mmdb'
      );

      expect(() => reader.connectionType('255.255.0.1')).toThrow(
        AddressNotFoundError
      );
    });

    it('throws an error if IP address is not valid', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Connection-Type-Test.mmdb'
      );

      expect(() => reader.connectionType('foobar')).toThrow(ValueError);
    });
  });

  describe('enterprise()', () => {
    it('returns enterprise data', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Enterprise-Test.mmdb'
      );

      const model: any = reader.enterprise('2.125.160.216');

      const expected = {
        city: {
          confidence: 50,
          geonameId: 2655045,
          names: {
            en: 'Boxford',
          },
        },
        continent: {
          code: 'EU',
          geonameId: 6255148,
          names: {
            de: 'Europa',
            en: 'Europe',
            es: 'Europa',
            fr: 'Europe',
            ja: 'ヨーロッパ',
            'pt-BR': 'Europa',
            ru: 'Европа',
            'zh-CN': '欧洲',
          },
        },
        country: {
          confidence: 95,
          geonameId: 2635167,
          isInEuropeanUnion: true,
          isoCode: 'GB',
          names: {
            de: 'Vereinigtes Königreich',
            en: 'United Kingdom',
            es: 'Reino Unido',
            fr: 'Royaume-Uni',
            ja: 'イギリス',
            'pt-BR': 'Reino Unido',
            ru: 'Великобритания',
            'zh-CN': '英国',
          },
        },
        location: {
          accuracyRadius: 100,
          latitude: 51.75,
          longitude: -1.25,
          timeZone: 'Europe/London',
        },
        maxmind: {},
        postal: {
          code: 'OX1',
          confidence: 20,
        },
        registeredCountry: {
          geonameId: 3017382,
          isInEuropeanUnion: true,
          isoCode: 'FR',
          names: {
            de: 'Frankreich',
            en: 'France',
            es: 'Francia',
            fr: 'France',
            ja: 'フランス共和国',
            'pt-BR': 'França',
            ru: 'Франция',
            'zh-CN': '法国',
          },
        },
        representedCountry: {},
        subdivisions: [
          {
            confidence: 70,
            geonameId: 6269131,
            isoCode: 'ENG',
            names: {
              en: 'England',
              es: 'Inglaterra',
              fr: 'Angleterre',
              'pt-BR': 'Inglaterra',
            },
          },
          {
            geonameId: 3333217,
            isoCode: 'WBK',
            names: {
              en: 'West Berkshire',
              ru: 'Западный Беркшир',
              'zh-CN': '西伯克郡',
            },
          },
        ],
        traits: {
          ipAddress: '2.125.160.216',
          isAnonymous: false,
          isAnonymousProxy: false,
          isAnonymousVpn: false,
          isHostingProvider: false,
          isLegitimateProxy: false,
          isPublicProxy: false,
          isResidentialProxy: false,
          isSatelliteProvider: false,
          isTorExitNode: false,
          network: '2.125.160.216/29',
          staticIpScore: 0.27,
        },
      };

      expect(model).toEqual(expected);
    });

    it('throws an error if db types do not match', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Enterprise-Test.mmdb'
      );

      expect(() => reader.anonymousIP('1.2.3.4')).toThrow(BadMethodCallError);
    });

    it('throws an error if IP address is not in database', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Enterprise-Test.mmdb'
      );

      expect(() => reader.enterprise('1.2.3.4')).toThrow(AddressNotFoundError);
    });

    it('throws an error if IP address is not valid', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Enterprise-Test.mmdb'
      );

      expect(() => reader.enterprise('foobar')).toThrow(ValueError);
    });
  });

  describe('isp()', () => {
    const mmdbReader = createMmdbReaderMock('GeoIP2-ISP', ispFixture);

    it('returns isp data', () => {
      const ispInstance = new ReaderModel(mmdbReader);
      const expected: any = camelcaseKeys(ispFixture);
      expected.ipAddress = ips.valid;
      expected.network = networks.valid;
      expect(ispInstance.isp(ips.valid)).toEqual(expected);
    });

    it('throws an error if db types do not match', () => {
      const errReader = cloneDeep(mmdbReader);
      errReader.metadata.databaseType = 'foo';

      const ispInstance = new ReaderModel(errReader);
      expect(() => ispInstance.isp(ips.valid)).toThrow(BadMethodCallError);
    });

    it('throws an error if IP address is not in database', () => {
      const ispInstance = new ReaderModel(mmdbReader);
      expect(() => ispInstance.isp(ips.notFound)).toThrow(AddressNotFoundError);
    });

    it('throws an error if IP address is not valid', () => {
      const instance = new ReaderModel(mmdbReader);
      expect(() => instance.isp(ips.invalid)).toThrow(ValueError);
    });
  });

  describe('domain()', () => {
    const mmdbReader = createMmdbReaderMock('GeoIP2-Domain', domainFixture);

    it('returns domain data', () => {
      const domainInstance = new ReaderModel(mmdbReader);
      const expected: any = camelcaseKeys(domainFixture);
      expected.ipAddress = ips.valid;
      expected.network = networks.valid;
      expect(domainInstance.domain(ips.valid)).toEqual(expected);
    });

    it('throws an error if db types do not match', () => {
      const errReader = cloneDeep(mmdbReader);
      errReader.metadata.databaseType = 'foo';

      const domainInstance = new ReaderModel(errReader);
      expect(() => domainInstance.domain(ips.valid)).toThrow(
        BadMethodCallError
      );
    });

    it('throws an error if IP address is not in database', () => {
      const domainInstance = new ReaderModel(mmdbReader);
      expect(() => domainInstance.domain(ips.notFound)).toThrow(
        AddressNotFoundError
      );
    });

    it('throws an error if IP address is not valid', () => {
      const instance = new ReaderModel(mmdbReader);
      expect(() => instance.domain(ips.invalid)).toThrow(ValueError);
    });
  });
});
