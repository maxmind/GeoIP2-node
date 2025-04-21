import { AddressNotFoundError, BadMethodCallError, ValueError } from './errors';
import Reader from './reader';

describe('ReaderModel', () => {
  describe('city()', () => {
    it('returns city data', async () => {
      expect.assertions(1);

      const cityInstance = await Reader.open(
        './test/data/test-data/GeoIP2-City-Test.mmdb'
      );

      const cityModel = cityInstance.city('2.125.160.216');

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
        maxmind: undefined,
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
        representedCountry: undefined,
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
          isAnycast: false,
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

    it('returns data when record only contains continent record', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-City-Test.mmdb'
      );

      const model = reader.city('2.3.3.1');

      const expected = {
        city: undefined,
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
        country: undefined,
        location: undefined,
        maxmind: undefined,
        postal: undefined,
        registeredCountry: undefined,
        representedCountry: undefined,
        subdivisions: undefined,
        traits: {
          ipAddress: '2.3.3.1',
          isAnonymous: false,
          isAnonymousProxy: false,
          isAnonymousVpn: false,
          isAnycast: false,
          isHostingProvider: false,
          isLegitimateProxy: false,
          isPublicProxy: false,
          isResidentialProxy: false,
          isSatelliteProvider: false,
          isTorExitNode: false,
          network: '2.3.3.0/24',
        },
      };

      expect(model).toEqual(expected);
    });

    it('returns data with anycast record', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-City-Test.mmdb'
      );

      const model = reader.city('214.1.1.0');

      const expected = {
        country: undefined,
        location: undefined,
        maxmind: undefined,
        postal: undefined,
        registeredCountry: undefined,
        representedCountry: undefined,
        subdivisions: undefined,
        traits: {
          ipAddress: '214.1.1.0',
          isAnonymous: false,
          isAnonymousProxy: false,
          isAnonymousVpn: false,
          isAnycast: true,
          isHostingProvider: false,
          isLegitimateProxy: false,
          isPublicProxy: false,
          isResidentialProxy: false,
          isSatelliteProvider: false,
          isTorExitNode: false,
          network: '214.1.1.0/24',
        },
      };

      expect(model).toEqual(expected);
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

      const countryModel = countryInstance.country('2.125.160.216');

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
        maxmind: undefined,
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
        representedCountry: undefined,
        traits: {
          ipAddress: '2.125.160.216',
          isAnonymous: false,
          isAnonymousProxy: false,
          isAnonymousVpn: false,
          isAnycast: false,
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

    it('returns data with anycast record', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Country-Test.mmdb'
      );

      const model = reader.country('214.1.1.0');

      const expected = {
        country: undefined,
        location: undefined,
        maxmind: undefined,
        registeredCountry: undefined,
        representedCountry: undefined,
        traits: {
          ipAddress: '214.1.1.0',
          isAnonymous: false,
          isAnonymousProxy: false,
          isAnonymousVpn: false,
          isAnycast: true,
          isHostingProvider: false,
          isLegitimateProxy: false,
          isPublicProxy: false,
          isResidentialProxy: false,
          isSatelliteProvider: false,
          isTorExitNode: false,
          network: '214.1.1.0/24',
        },
      };

      expect(model).toEqual(expected);
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

      const model = reader.anonymousIP('81.2.69.1');

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

      const model = reader.anonymousIP('2.125.160.216');

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

  describe('anonymousPlus()', () => {
    it('returns anonymousPlus data', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP-Anonymous-Plus-Test.mmdb'
      );

      const model = reader.anonymousPlus('1.2.0.1');

      const expected = {
        anonymizerConfidence: 30,
        ipAddress: '1.2.0.1',
        isAnonymous: true,
        isAnonymousVpn: true,
        isHostingProvider: false,
        isPublicProxy: false,
        isResidentialProxy: false,
        isTorExitNode: false,
        network: '1.2.0.1/32',
        networkLastSeen: '2025-04-14',
        providerName: 'foo',
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

      const model = reader.asn('1.128.0.1');

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

      const model = reader.connectionType('1.0.0.1');

      const expected = {
        connectionType: 'Cable/DSL',
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

      const model = reader.enterprise('2.125.160.216');

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
        maxmind: undefined,
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
        representedCountry: undefined,
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
            confidence: 60,
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
          isAnycast: false,
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

    it('returns data with anycast record', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Enterprise-Test.mmdb'
      );

      const model = reader.enterprise('214.1.1.0');

      const expected = {
        country: undefined,
        location: undefined,
        maxmind: undefined,
        postal: undefined,
        registeredCountry: undefined,
        representedCountry: undefined,
        subdivisions: undefined,
        traits: {
          ipAddress: '214.1.1.0',
          isAnonymous: false,
          isAnonymousProxy: false,
          isAnonymousVpn: false,
          isAnycast: true,
          isHostingProvider: false,
          isLegitimateProxy: false,
          isPublicProxy: false,
          isResidentialProxy: false,
          isSatelliteProvider: false,
          isTorExitNode: false,
          network: '214.1.1.0/24',
        },
      };

      expect(model).toEqual(expected);
    });

    it('returns enterprise data with MCC/MNC fields', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Enterprise-Test.mmdb'
      );

      const model = reader.enterprise('149.101.100.0');

      const expected = {
        city: undefined,
        continent: {
          code: 'NA',
          geonameId: 6255149,
          names: {
            de: 'Nordamerika',
            en: 'North America',
            es: 'América del Norte',
            fr: 'Amérique du Nord',
            ja: '北アメリカ',
            'pt-BR': 'América do Norte',
            ru: 'Северная Америка',
            'zh-CN': '北美洲',
          },
        },
        country: {
          confidence: 99,
          geonameId: 6252001,
          isoCode: 'US',
          names: {
            de: 'USA',
            en: 'United States',
            es: 'Estados Unidos',
            fr: 'États-Unis',
            ja: 'アメリカ合衆国',
            'pt-BR': 'Estados Unidos',
            ru: 'США',
            'zh-CN': '美国',
          },
        },
        location: {
          accuracyRadius: 1000,
          latitude: 37.751,
          longitude: -97.822,
          timeZone: 'America/Chicago',
        },
        maxmind: undefined,
        postal: undefined,
        registeredCountry: {
          geonameId: 2635167,
          isInEuropeanUnion: false,
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
        representedCountry: undefined,
        subdivisions: undefined,
        traits: {
          autonomousSystemNumber: 6167,
          autonomousSystemOrganization: 'CELLCO-PART',
          ipAddress: '149.101.100.0',
          isAnonymous: false,
          isAnonymousProxy: false,
          isAnonymousVpn: false,
          isAnycast: false,
          isHostingProvider: false,
          isLegitimateProxy: false,
          isPublicProxy: false,
          isResidentialProxy: false,
          isSatelliteProvider: false,
          isTorExitNode: false,
          isp: 'Verizon Wireless',
          mobileCountryCode: '310',
          mobileNetworkCode: '004',
          network: '149.101.100.0/28',
          organization: 'Verizon Wireless',
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
    it('returns isp data', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-ISP-Test.mmdb'
      );

      const model = reader.isp('1.128.0.1');

      const expected = {
        autonomousSystemNumber: 1221,
        autonomousSystemOrganization: 'Telstra Pty Ltd',
        ipAddress: '1.128.0.1',
        isp: 'Telstra Internet',
        network: '1.128.0.0/11',
        organization: 'Telstra Internet',
      };

      expect(model).toEqual(expected);
    });

    it('returns isp data with MCC/MNC fields', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-ISP-Test.mmdb'
      );

      const model = reader.isp('149.101.100.0');

      const expected = {
        autonomousSystemNumber: 6167,
        autonomousSystemOrganization: 'CELLCO-PART',
        ipAddress: '149.101.100.0',
        isp: 'Verizon Wireless',
        mobileCountryCode: '310',
        mobileNetworkCode: '004',
        network: '149.101.100.0/28',
        organization: 'Verizon Wireless',
      };

      expect(model).toEqual(expected);
    });

    it('throws an error if db types do not match', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-ISP-Test.mmdb'
      );

      expect(() => reader.city('1.2.3.4')).toThrow(BadMethodCallError);
    });

    it('throws an error if IP address is not in database', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-ISP-Test.mmdb'
      );

      expect(() => reader.isp('255.1.1.1')).toThrow(AddressNotFoundError);
    });

    it('throws an error if IP address is not valid', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-ISP-Test.mmdb'
      );

      expect(() => reader.isp('foobar')).toThrow(ValueError);
    });
  });

  describe('domain()', () => {
    it('returns domain data', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Domain-Test.mmdb'
      );

      const model = reader.domain('1.2.0.1');

      const expected = {
        domain: 'maxmind.com',
        ipAddress: '1.2.0.1',
        network: '1.2.0.0/16',
      };

      expect(model).toEqual(expected);
    });

    it('throws an error if db types do not match', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Domain-Test.mmdb'
      );

      expect(() => reader.city('1.2.3.4')).toThrow(BadMethodCallError);
    });

    it('throws an error if IP address is not in database', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Domain-Test.mmdb'
      );

      expect(() => reader.domain('255.1.1.1')).toThrow(AddressNotFoundError);
    });

    it('throws an error if IP address is not valid', async () => {
      expect.assertions(1);

      const reader = await Reader.open(
        './test/data/test-data/GeoIP2-Domain-Test.mmdb'
      );

      expect(() => reader.domain('foobar')).toThrow(ValueError);
    });
  });
});
