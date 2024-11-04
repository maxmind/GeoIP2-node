import nock from 'nock';
import * as geoip2Fixture from '../fixtures/geoip2.json';
import Client from './webServiceClient';
import * as models from './models';

const baseUrl = 'https://geoip.maxmind.com';
const nockInstance = nock(baseUrl);
const fullPath = (path: string, ipAddress: string) =>
  `/geoip/v2.1/${path}/${ipAddress}`;
const auth = {
  pass: 'foo',
  user: '123',
};

describe('WebServiceClient', () => {
  const client = new Client(auth.user, auth.pass);

  describe('city()', () => {
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

    it('returns a city class', async () => {
      const ip = '8.8.8.8';
      expect.assertions(96);

      nockInstance
        .get(fullPath('city', ip))
        .basicAuth(auth)
        .reply(200, testFixture);

      const got: models.City = await client.city(ip);

      expect(got.city!.confidence).toEqual(25);
      expect(got.city!.geonameId).toEqual(54321);
      expect(got.city!.names.de).toEqual('Los Angeles');
      expect(got.city!.names.en).toEqual('Los Angeles');
      expect(got.city!.names.es).toEqual('Los Ángeles');
      expect(got.city!.names.fr).toEqual('Los Angeles');
      expect(got.city!.names.ja).toEqual('ロサンゼルス市');
      expect(got.city!.names['pt-BR']).toEqual('Los Angeles');
      expect(got.city!.names.ru).toEqual('Лос-Анджелес');
      expect(got.city!.names['zh-CN']).toEqual('洛杉矶');

      expect(got.continent!.code).toEqual('NA');
      expect(got.continent!.geonameId).toEqual(123456);
      expect(got.continent!.names.de).toEqual('Nordamerika');
      expect(got.continent!.names.en).toEqual('North America');
      expect(got.continent!.names.es).toEqual('América del Norte');
      expect(got.continent!.names.fr).toEqual('Amérique du Nord');
      expect(got.continent!.names.ja).toEqual('北アメリカ');
      expect(got.continent!.names['pt-BR']).toEqual('América do Norte');
      expect(got.continent!.names.ru).toEqual('Северная Америка');
      expect(got.continent!.names['zh-CN']).toEqual('北美洲');

      expect(got.country!.confidence).toEqual(75);
      expect(got.country!.geonameId).toEqual(6252001);
      expect(got.country!.isoCode).toEqual('US');
      expect(got.country!.names.de).toEqual('USA');
      expect(got.country!.names.en).toEqual('United States');
      expect(got.country!.names.es).toEqual('Estados Unidos');
      expect(got.country!.names.fr).toEqual('États-Unis');
      expect(got.country!.names.ja).toEqual('アメリカ合衆国');
      expect(got.country!.names['pt-BR']).toEqual('Estados Unidos');
      expect(got.country!.names.ru).toEqual('США');
      expect(got.country!.names['zh-CN']).toEqual('美国');

      expect(got.location!.accuracyRadius).toEqual(20);
      expect(got.location!.averageIncome).toEqual(128321);
      expect(got.location!.latitude).toEqual(37.6293);
      expect(got.location!.longitude).toEqual(-122.1163);
      expect(got.location!.metroCode).toEqual(807);
      expect(got.location!.populationDensity).toEqual(7122);
      expect(got.location!.timeZone).toEqual('America/Los_Angeles');

      expect(got.maxmind!.queriesRemaining).toEqual(54321);

      expect(got.postal!.code).toEqual('90001');
      expect(got.postal!.confidence).toEqual(10);

      expect(got.registeredCountry!.geonameId).toEqual(6252001);
      expect(got.registeredCountry!.isoCode).toEqual('US');
      expect(got.registeredCountry!.isInEuropeanUnion).toEqual(false);
      expect(got.registeredCountry!.names.de).toEqual('USA');
      expect(got.registeredCountry!.names.en).toEqual('United States');
      expect(got.registeredCountry!.names.es).toEqual('Estados Unidos');
      expect(got.registeredCountry!.names.fr).toEqual('États-Unis');
      expect(got.registeredCountry!.names.ja).toEqual('アメリカ合衆国');
      expect(got.registeredCountry!.names['pt-BR']).toEqual('Estados Unidos');
      expect(got.registeredCountry!.names.ru).toEqual('США');
      expect(got.registeredCountry!.names['zh-CN']).toEqual('美国');

      expect(got.representedCountry!.geonameId).toEqual(6252001);
      expect(got.representedCountry!.isoCode).toEqual('US');
      expect(got.representedCountry!.names.de).toEqual('USA');
      expect(got.representedCountry!.names.en).toEqual('United States');
      expect(got.representedCountry!.names.es).toEqual('Estados Unidos');
      expect(got.representedCountry!.names.fr).toEqual('États-Unis');
      expect(got.representedCountry!.names.ja).toEqual('アメリカ合衆国');
      expect(got.representedCountry!.names['pt-BR']).toEqual('Estados Unidos');
      expect(got.representedCountry!.names.ru).toEqual('США');
      expect(got.representedCountry!.names['zh-CN']).toEqual('美国');
      expect(got.representedCountry!.type).toEqual('military');

      expect(got.subdivisions![0].confidence).toEqual(50);
      expect(got.subdivisions![0].geonameId).toEqual(5332921);
      expect(got.subdivisions![0].isoCode).toEqual('CA');
      expect(got.subdivisions![0].names.de).toEqual('Kalifornien');
      expect(got.subdivisions![0].names.en).toEqual('California');
      expect(got.subdivisions![0].names.es).toEqual('California');
      expect(got.subdivisions![0].names.fr).toEqual('Californie');
      expect(got.subdivisions![0].names.ja).toEqual('カリフォルニア');
      expect(got.subdivisions![0].names.ru).toEqual('Калифорния');
      expect(got.subdivisions![0].names['zh-CN']).toEqual('加州');

      expect(got.traits.autonomousSystemNumber).toEqual(1239);
      expect(got.traits.autonomousSystemOrganization).toEqual(
        'Linkem IR WiMax Network'
      );
      expect(got.traits.connectionType).toEqual('cable');
      expect(got.traits.domain).toEqual('example.com');
      expect(got.traits.ipAddress).toEqual('11.11.11.11');
      expect(got.traits.isAnonymous).toEqual(true);
      expect(got.traits.isAnonymousProxy).toEqual(true);
      expect(got.traits.isAnonymousVpn).toEqual(false);
      expect(got.traits.isAnycast).toEqual(true);
      expect(got.traits.isHostingProvider).toEqual(false);
      expect(got.traits.isLegitimateProxy).toEqual(true);
      expect(got.traits.isPublicProxy).toEqual(true);
      expect(got.traits.isResidentialProxy).toEqual(true);
      expect(got.traits.isSatelliteProvider).toEqual(true);
      expect(got.traits.isTorExitNode).toEqual(true);
      expect(got.traits.isp).toEqual('Linkem spa');
      expect(got.traits.mobileCountryCode).toEqual('310');
      expect(got.traits.mobileNetworkCode).toEqual('004');
      expect(got.traits.network).toEqual('11.11.11.0/24');
      expect(got.traits.organization).toEqual('Linkem IR WiMax Network');
      expect(got.traits.staticIpScore).toEqual(1.3);
      expect(got.traits.userCount).toEqual(2);
      expect(got.traits.userType).toEqual('traveler');
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

    it('returns a country class', async () => {
      const ip = '8.8.8.8';
      expect.assertions(64);

      nockInstance
        .get(fullPath('country', ip))
        .basicAuth(auth)
        .reply(200, testFixture);

      const got: models.Country = await client.country(ip);

      expect(got.continent!.code).toEqual('NA');
      expect(got.continent!.geonameId).toEqual(123456);
      expect(got.continent!.names.de).toEqual('Nordamerika');
      expect(got.continent!.names.en).toEqual('North America');
      expect(got.continent!.names.es).toEqual('América del Norte');
      expect(got.continent!.names.fr).toEqual('Amérique du Nord');
      expect(got.continent!.names.ja).toEqual('北アメリカ');
      expect(got.continent!.names['pt-BR']).toEqual('América do Norte');
      expect(got.continent!.names.ru).toEqual('Северная Америка');
      expect(got.continent!.names['zh-CN']).toEqual('北美洲');

      expect(got.country!.confidence).toEqual(75);
      expect(got.country!.geonameId).toEqual(6252001);
      expect(got.country!.isoCode).toEqual('US');
      expect(got.country!.names.de).toEqual('USA');
      expect(got.country!.names.en).toEqual('United States');
      expect(got.country!.names.es).toEqual('Estados Unidos');
      expect(got.country!.names.fr).toEqual('États-Unis');
      expect(got.country!.names.ja).toEqual('アメリカ合衆国');
      expect(got.country!.names['pt-BR']).toEqual('Estados Unidos');
      expect(got.country!.names.ru).toEqual('США');
      expect(got.country!.names['zh-CN']).toEqual('美国');

      expect(got.maxmind!.queriesRemaining).toEqual(54321);

      expect(got.registeredCountry!.geonameId).toEqual(6252001);
      expect(got.registeredCountry!.isoCode).toEqual('US');
      expect(got.registeredCountry!.isInEuropeanUnion!).toEqual(false);
      expect(got.registeredCountry!.names.de).toEqual('USA');
      expect(got.registeredCountry!.names.en).toEqual('United States');
      expect(got.registeredCountry!.names.es).toEqual('Estados Unidos');
      expect(got.registeredCountry!.names.fr).toEqual('États-Unis');
      expect(got.registeredCountry!.names.ja).toEqual('アメリカ合衆国');
      expect(got.registeredCountry!.names['pt-BR']).toEqual('Estados Unidos');
      expect(got.registeredCountry!.names.ru).toEqual('США');
      expect(got.registeredCountry!.names['zh-CN']).toEqual('美国');

      expect(got.representedCountry!.geonameId).toEqual(6252001);
      expect(got.representedCountry!.isoCode).toEqual('US');
      expect(got.representedCountry!.names.de).toEqual('USA');
      expect(got.representedCountry!.names.en).toEqual('United States');
      expect(got.representedCountry!.names.es).toEqual('Estados Unidos');
      expect(got.representedCountry!.names.fr).toEqual('États-Unis');
      expect(got.representedCountry!.names.ja).toEqual('アメリカ合衆国');
      expect(got.representedCountry!.names['pt-BR']).toEqual('Estados Unidos');
      expect(got.representedCountry!.names.ru).toEqual('США');
      expect(got.representedCountry!.names['zh-CN']).toEqual('美国');
      expect(got.representedCountry!.type).toEqual('military');

      expect(got.traits.autonomousSystemNumber!).toEqual(1239);
      expect(got.traits.autonomousSystemOrganization!).toEqual(
        'Linkem IR WiMax Network'
      );
      expect(got.traits.connectionType!).toEqual('cable');
      expect(got.traits.domain!).toEqual('example.com');
      expect(got.traits.ipAddress!).toEqual('11.11.11.11');
      expect(got.traits.isAnonymous!).toEqual(true);
      expect(got.traits.isAnonymousProxy!).toEqual(true);
      expect(got.traits.isAnonymousVpn!).toEqual(false);
      expect(got.traits.isHostingProvider!).toEqual(false);
      expect(got.traits.isLegitimateProxy!).toEqual(true);
      expect(got.traits.isPublicProxy!).toEqual(true);
      expect(got.traits.isResidentialProxy!).toEqual(true);
      expect(got.traits.isSatelliteProvider!).toEqual(true);
      expect(got.traits.isTorExitNode!).toEqual(true);
      expect(got.traits.isp!).toEqual('Linkem spa');
      expect(got.traits.network!).toEqual('11.11.11.0/24');
      expect(got.traits.organization!).toEqual('Linkem IR WiMax Network');
      expect(got.traits.staticIpScore!).toEqual(1.3);
      expect(got.traits.userCount!).toEqual(2);
      expect(got.traits.userType!).toEqual('traveler');
    });
  });

  describe('insights()', () => {
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

    it('returns an insight class', async () => {
      const ip = '8.8.8.8';
      expect.assertions(96);

      nockInstance
        .get(fullPath('insights', ip))
        .basicAuth(auth)
        .reply(200, testFixture);

      const got: models.Insights = await client.insights(ip);

      expect(got.city!.confidence).toEqual(25);
      expect(got.city!.geonameId).toEqual(54321);
      expect(got.city!.names.de).toEqual('Los Angeles');
      expect(got.city!.names.en).toEqual('Los Angeles');
      expect(got.city!.names.es).toEqual('Los Ángeles');
      expect(got.city!.names.fr).toEqual('Los Angeles');
      expect(got.city!.names.ja).toEqual('ロサンゼルス市');
      expect(got.city!.names['pt-BR']).toEqual('Los Angeles');
      expect(got.city!.names.ru).toEqual('Лос-Анджелес');
      expect(got.city!.names['zh-CN']).toEqual('洛杉矶');

      expect(got.continent!.code).toEqual('NA');
      expect(got.continent!.geonameId).toEqual(123456);
      expect(got.continent!.names.de).toEqual('Nordamerika');
      expect(got.continent!.names.en).toEqual('North America');
      expect(got.continent!.names.es).toEqual('América del Norte');
      expect(got.continent!.names.fr).toEqual('Amérique du Nord');
      expect(got.continent!.names.ja).toEqual('北アメリカ');
      expect(got.continent!.names['pt-BR']).toEqual('América do Norte');
      expect(got.continent!.names.ru).toEqual('Северная Америка');
      expect(got.continent!.names['zh-CN']).toEqual('北美洲');

      expect(got.country!.confidence).toEqual(75);
      expect(got.country!.geonameId).toEqual(6252001);
      expect(got.country!.isoCode).toEqual('US');
      expect(got.country!.names.de).toEqual('USA');
      expect(got.country!.names.en).toEqual('United States');
      expect(got.country!.names.es).toEqual('Estados Unidos');
      expect(got.country!.names.fr).toEqual('États-Unis');
      expect(got.country!.names.ja).toEqual('アメリカ合衆国');
      expect(got.country!.names['pt-BR']).toEqual('Estados Unidos');
      expect(got.country!.names.ru).toEqual('США');
      expect(got.country!.names['zh-CN']).toEqual('美国');

      expect(got.location!.accuracyRadius).toEqual(20);
      expect(got.location!.averageIncome).toEqual(128321);
      expect(got.location!.latitude).toEqual(37.6293);
      expect(got.location!.longitude).toEqual(-122.1163);
      expect(got.location!.metroCode).toEqual(807);
      expect(got.location!.populationDensity).toEqual(7122);
      expect(got.location!.timeZone).toEqual('America/Los_Angeles');

      expect(got.maxmind!.queriesRemaining).toEqual(54321);

      expect(got.postal!.code).toEqual('90001');
      expect(got.postal!.confidence).toEqual(10);

      expect(got.registeredCountry!.geonameId).toEqual(6252001);
      expect(got.registeredCountry!.isoCode).toEqual('US');
      expect(got.registeredCountry!.isInEuropeanUnion).toEqual(false);
      expect(got.registeredCountry!.names.de).toEqual('USA');
      expect(got.registeredCountry!.names.en).toEqual('United States');
      expect(got.registeredCountry!.names.es).toEqual('Estados Unidos');
      expect(got.registeredCountry!.names.fr).toEqual('États-Unis');
      expect(got.registeredCountry!.names.ja).toEqual('アメリカ合衆国');
      expect(got.registeredCountry!.names['pt-BR']).toEqual('Estados Unidos');
      expect(got.registeredCountry!.names.ru).toEqual('США');
      expect(got.registeredCountry!.names['zh-CN']).toEqual('美国');

      expect(got.representedCountry!.geonameId).toEqual(6252001);
      expect(got.representedCountry!.isoCode).toEqual('US');
      expect(got.representedCountry!.names.de).toEqual('USA');
      expect(got.representedCountry!.names.en).toEqual('United States');
      expect(got.representedCountry!.names.es).toEqual('Estados Unidos');
      expect(got.representedCountry!.names.fr).toEqual('États-Unis');
      expect(got.representedCountry!.names.ja).toEqual('アメリカ合衆国');
      expect(got.representedCountry!.names['pt-BR']).toEqual('Estados Unidos');
      expect(got.representedCountry!.names.ru).toEqual('США');
      expect(got.representedCountry!.names['zh-CN']).toEqual('美国');
      expect(got.representedCountry!.type).toEqual('military');

      expect(got.subdivisions![0].confidence).toEqual(50);
      expect(got.subdivisions![0].geonameId).toEqual(5332921);
      expect(got.subdivisions![0].isoCode).toEqual('CA');
      expect(got.subdivisions![0].names.de).toEqual('Kalifornien');
      expect(got.subdivisions![0].names.en).toEqual('California');
      expect(got.subdivisions![0].names.es).toEqual('California');
      expect(got.subdivisions![0].names.fr).toEqual('Californie');
      expect(got.subdivisions![0].names.ja).toEqual('カリフォルニア');
      expect(got.subdivisions![0].names.ru).toEqual('Калифорния');
      expect(got.subdivisions![0].names['zh-CN']).toEqual('加州');

      expect(got.traits.autonomousSystemNumber).toEqual(1239);
      expect(got.traits.autonomousSystemOrganization).toEqual(
        'Linkem IR WiMax Network'
      );
      expect(got.traits.connectionType).toEqual('cable');
      expect(got.traits.domain).toEqual('example.com');
      expect(got.traits.ipAddress).toEqual('11.11.11.11');
      expect(got.traits.isAnonymous).toEqual(true);
      expect(got.traits.isAnonymousProxy).toEqual(true);
      expect(got.traits.isAnycast).toEqual(true);
      expect(got.traits.isAnonymousVpn).toEqual(false);
      expect(got.traits.isHostingProvider).toEqual(false);
      expect(got.traits.isLegitimateProxy).toEqual(true);
      expect(got.traits.isPublicProxy).toEqual(true);
      expect(got.traits.isResidentialProxy).toEqual(true);
      expect(got.traits.isSatelliteProvider).toEqual(true);
      expect(got.traits.isTorExitNode).toEqual(true);
      expect(got.traits.isp).toEqual('Linkem spa');
      expect(got.traits.mobileCountryCode).toEqual('310');
      expect(got.traits.mobileNetworkCode).toEqual('004');
      expect(got.traits.network).toEqual('11.11.11.0/24');
      expect(got.traits.organization).toEqual('Linkem IR WiMax Network');
      expect(got.traits.staticIpScore).toEqual(1.3);
      expect(got.traits.userCount).toEqual(2);
      expect(got.traits.userType).toEqual('traveler');
    });
  });

  describe('timeout handling', () => {
    afterEach(() => {
      nock.cleanAll();
    });
    it('should time out if the request takes too long', async () => {
      const ip = '8.8.8.8';

      const client = new Client(auth.user, auth.pass, {
        timeout: 10,
      });

      nock('https://geoip.maxmind.com')
        .get(`/geoip/v2.1/city/${ip}`)
        .delay(200) // Delay the response to trigger the timeout
        .reply(200, geoip2Fixture);

      await expect(client.city(ip)).rejects.toEqual({
        code: 'FETCH_TIMEOUT',
        error: 'The request timed out',
        url: `https://geoip.maxmind.com/geoip/v2.1/city/${ip}`,
      });
    });
  });

  describe('error handling', () => {
    it('rejects if the IP address is invalid', () => {
      const ip = 'foo';
      expect.assertions(1);

      return expect(client.city(ip)).rejects.toEqual({
        code: 'IP_ADDRESS_INVALID',
        error: 'The IP address provided is invalid',
        url: baseUrl + fullPath('city', ip),
      });
    });

    it('handles 5xx level errors', () => {
      const ip = '8.8.8.8';
      expect.assertions(1);

      nockInstance.get(fullPath('city', ip)).basicAuth(auth).reply(500);

      return expect(client.city(ip)).rejects.toEqual({
        code: 'SERVER_ERROR',
        error: 'Received a server error with HTTP status code: 500',
        url: baseUrl + fullPath('city', ip),
      });
    });

    it('handles 3xx level errors', () => {
      const ip = '8.8.8.8';
      expect.assertions(1);

      nockInstance.get(fullPath('city', ip)).basicAuth(auth).reply(300);

      return expect(client.city(ip)).rejects.toEqual({
        code: 'HTTP_STATUS_CODE_ERROR',
        error: 'Received an unexpected HTTP status code: 300',
        url: baseUrl + fullPath('city', ip),
      });
    });

    it('handles errors with unknown payload', () => {
      const ip = '8.8.8.8';
      expect.assertions(1);

      nockInstance
        .get(fullPath('city', ip))
        .basicAuth(auth)
        .reply(401, { foo: 'bar' });

      return expect(client.city(ip)).rejects.toEqual({
        code: 'INVALID_RESPONSE_BODY',
        error: 'Received an invalid or unparseable response body',
        url: baseUrl + fullPath('city', ip),
      });
    });

    // it('handles general http.request errors', () => {
    //   const ip = '8.8.8.8';
    //
    //   const error = {
    //     code: 'FOO_ERR',
    //     message: 'some foo error',
    //   };
    //
    //   const expected = {
    //     code: error.code,
    //     error: error.message,
    //     url: baseUrl + fullPath('city', ip),
    //   };
    //
    //   expect.assertions(1);
    //
    //   nockInstance
    //     .get(fullPath('city', ip))
    //     .basicAuth(auth)
    //     .replyWithError(error);
    //
    //   return expect(client.city(ip)).rejects.toEqual(expected);
    // });

    test.each`
      status | code                       | error
      ${400} | ${'IP_ADDRESS_INVALID'}    | ${'ip address invalid'}
      ${400} | ${'IP_ADDRESS_REQUIRED'}   | ${'ip address required'}
      ${400} | ${'IP_ADDRESS_RESERVED'}   | ${'ip address reserved'}
      ${404} | ${'IP_ADDRESS_NOT_FOUND'}  | ${'ip address not found'}
      ${401} | ${'AUTHORIZATION_INVALID'} | ${'auth required'}
      ${401} | ${'LICENSE_KEY_REQUIRED'}  | ${'license key required'}
      ${401} | ${'USER_ID_REQUIRED'}      | ${'user id required'}
      ${402} | ${'OUT_OF_QUERIES'}        | ${'out of queries'}
      ${403} | ${'PERMISSION_REQUIRED'}   | ${'permission required'}
    `('handles $code error', ({ code, error, status }) => {
      const ip = '8.8.8.8';

      nockInstance
        .get(fullPath('city', ip))
        .basicAuth(auth)
        .reply(status, { code, error });
      expect.assertions(1);

      return expect(client.city(ip)).rejects.toEqual({
        code,
        error,
        url: baseUrl + fullPath('city', ip),
      });
    });
  });
});

describe('WebServiceClient with options', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let client: any;

  beforeAll(() => {
    client = new Client(auth.user, auth.pass, {
      host: 'geolite.info',
      timeout: 1000,
    });
  });

  it('sets host', () => {
    expect(client.host).toEqual('geolite.info');
  });

  it('sets timeout', () => {
    expect(client.timeout).toEqual(1000);
  });
});

describe('WebServiceClient with empty options', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let client: any;

  beforeAll(() => {
    client = new Client(auth.user, auth.pass, {});
  });

  it('sets host', () => {
    expect(client.host).toEqual('geoip.maxmind.com');
  });

  it('sets timeout', () => {
    expect(client.timeout).toEqual(3000);
  });
});

describe('WebServiceClient with timeout', () => {
  it('sets timeout', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client: any = new Client(auth.user, auth.pass, 1000);
    expect(client.timeout).toEqual(1000);
  });
});
