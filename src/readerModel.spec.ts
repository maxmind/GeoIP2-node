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
    const testFixture = {
      continent: geoip2Fixture.continent,
      country: geoip2Fixture.country,
      maxmind: geoip2Fixture.maxmind,
      registered_country: geoip2Fixture.registered_country,
      represented_country: geoip2Fixture.represented_country,
      traits: geoip2Fixture.traits,
    };

    const mmdbReader = createMmdbReaderMock(
      'GeoIP2-Country-Super-Special',
      testFixture
    );

    it('returns city data', () => {
      const countryInstance = new ReaderModel(mmdbReader);
      expect(countryInstance.country(ips.valid)).toEqual(
        camelcaseKeys(testFixture, { deep: true, exclude: [/\-/] })
      );
      expect(countryInstance.country(ips.valid).traits.ipAddress).toEqual(
        ips.valid
      );
    });

    it('throws an error if db types do not match', () => {
      const errReader = cloneDeep(mmdbReader);
      errReader.metadata.databaseType = 'foo';

      const countryInstance = new ReaderModel(errReader);
      expect(() => countryInstance.country(ips.valid)).toThrow(
        BadMethodCallError
      );
    });

    it('throws an error if IP address is not in database', () => {
      const countryInstance = new ReaderModel(mmdbReader);
      expect(() => countryInstance.country(ips.notFound)).toThrow(
        AddressNotFoundError
      );
    });

    it('throws an error if IP address is not valid', () => {
      const instance = new ReaderModel(mmdbReader);
      expect(() => instance.country(ips.invalid)).toThrow(ValueError);
    });
  });

  describe('anonymousIP()', () => {
    const mmdbReader = createMmdbReaderMock(
      'GeoIP2-Anonymous-IP',
      anonymousIPFixture
    );

    it('returns anonymousIP data', () => {
      const anonymousIPInstance = new ReaderModel(mmdbReader);
      const expected: any = camelcaseKeys(anonymousIPFixture);
      expected.ipAddress = ips.valid;
      expected.network = networks.valid;
      expect(anonymousIPInstance.anonymousIP(ips.valid)).toEqual(expected);
    });

    it('throws an error if db types do not match', () => {
      const errReader = cloneDeep(mmdbReader);
      errReader.metadata.databaseType = 'foo';

      const anonymousIPInstance = new ReaderModel(errReader);
      expect(() => anonymousIPInstance.anonymousIP(ips.valid)).toThrow(
        BadMethodCallError
      );
    });

    it('throws an error if IP address is not in database', () => {
      const anonymousIPInstance = new ReaderModel(mmdbReader);
      expect(() => anonymousIPInstance.anonymousIP(ips.notFound)).toThrow(
        AddressNotFoundError
      );
    });

    it('throws an error if IP address is not valid', () => {
      const instance = new ReaderModel(mmdbReader);
      expect(() => instance.anonymousIP(ips.invalid)).toThrow(ValueError);
    });

    it('returns false for undefined values', () => {
      const anonymousIPInstance = new ReaderModel(mmdbReader);
      const expected = {
        ipAddress: ips.empty,
        isAnonymous: false,
        isAnonymousVpn: false,
        isHostingProvider: false,
        isPublicProxy: false,
        isResidentialProxy: false,
        isTorExitNode: false,
        network: networks.empty,
      };

      expect(anonymousIPInstance.anonymousIP(ips.empty)).toEqual(expected);
    });
  });

  describe('asn()', () => {
    const mmdbReader = createMmdbReaderMock('GeoLite2-ASN', asnFixture);

    it('returns asn data', () => {
      const asnInstance = new ReaderModel(mmdbReader);
      const expected: any = camelcaseKeys(asnFixture);
      expected.ipAddress = ips.valid;
      expected.network = networks.valid;
      expect(asnInstance.asn(ips.valid)).toEqual(expected);
    });

    it('throws an error if db types do not match', () => {
      const errReader = cloneDeep(mmdbReader);
      errReader.metadata.databaseType = 'foo';

      const asnInstance = new ReaderModel(errReader);
      expect(() => asnInstance.asn(ips.valid)).toThrow(BadMethodCallError);
    });

    it('throws an error if IP address is not in database', () => {
      const asnInstance = new ReaderModel(mmdbReader);
      expect(() => asnInstance.asn(ips.notFound)).toThrow(AddressNotFoundError);
    });

    it('throws an error if IP address is not valid', () => {
      const instance = new ReaderModel(mmdbReader);
      expect(() => instance.asn(ips.invalid)).toThrow(ValueError);
    });
  });

  describe('connectionType()', () => {
    const mmdbReader = createMmdbReaderMock(
      'GeoIP2-Connection-Type',
      connectionTypeFixture
    );

    it('returns connection-type data', () => {
      const connectionTypeInstance = new ReaderModel(mmdbReader);
      const expected: any = camelcaseKeys(connectionTypeFixture);
      expected.ipAddress = ips.valid;
      expected.network = networks.valid;
      expect(connectionTypeInstance.connectionType(ips.valid)).toEqual(
        expected
      );
    });

    it('throws an error if db types do not match', () => {
      const errReader = cloneDeep(mmdbReader);
      errReader.metadata.databaseType = 'foo';

      const connectionTypeInstance = new ReaderModel(errReader);
      expect(() => connectionTypeInstance.connectionType(ips.valid)).toThrow(
        BadMethodCallError
      );
    });

    it('throws an error if IP address is not in database', () => {
      const connectionTypeInstance = new ReaderModel(mmdbReader);
      expect(() => connectionTypeInstance.connectionType(ips.notFound)).toThrow(
        AddressNotFoundError
      );
    });

    it('throws an error if IP address is not valid', () => {
      const instance = new ReaderModel(mmdbReader);
      expect(() => instance.connectionType(ips.invalid)).toThrow(ValueError);
    });
  });

  describe('enterprise()', () => {
    const testFixture = {
      city: geoip2Fixture.city,
      continent: geoip2Fixture.continent,
      country: geoip2Fixture.country,
      location: geoip2Fixture.location,
      maxmind: geoip2Fixture.maxmind,
      postal: geoip2Fixture.postal,
      registered_country: geoip2Fixture.registered_country,
      represented_country: geoip2Fixture.represented_country,
      subdivisions: geoip2Fixture.subdivisions,
      traits: geoip2Fixture.traits,
    };

    const mmdbReader = createMmdbReaderMock(
      'GeoIP2-Enterprise-Super-Special',
      testFixture
    );

    it('returns enterprise data', () => {
      const enterpriseInstance = new ReaderModel(mmdbReader);
      const expected: any = camelcaseKeys(testFixture, {
        deep: true,
        exclude: [/\-/],
      });
      camelcaseKeys(connectionTypeFixture);
      expected.traits.ipAddress = ips.valid;
      expected.traits.network = networks.valid;
      expect(enterpriseInstance.enterprise(ips.valid)).toEqual(expected);
    });

    it('throws an error if db types do not match', () => {
      const errReader = cloneDeep(mmdbReader);
      errReader.metadata.databaseType = 'foo';

      const enterpriseInstance = new ReaderModel(errReader);
      expect(() => enterpriseInstance.enterprise(ips.valid)).toThrow(
        BadMethodCallError
      );
    });

    it('throws an error if IP address is not in database', () => {
      const enterpriseInstance = new ReaderModel(mmdbReader);
      expect(() => enterpriseInstance.enterprise(ips.notFound)).toThrow(
        AddressNotFoundError
      );
    });

    it('throws an error if IP address is not valid', () => {
      const instance = new ReaderModel(mmdbReader);
      expect(() => instance.enterprise(ips.invalid)).toThrow(ValueError);
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
