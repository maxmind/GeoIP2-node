import geoip2Fixture from '../fixtures/geoip2.json' with { type: 'json' };
import { WebServiceError } from './errors.js';
import Client from './webServiceClient.js';
import * as models from './models/index.js';

const baseUrl = 'https://geoip.maxmind.com';
const fullPath = (path: string, ipAddress: string) =>
  `/geoip/v2.1/${path}/${ipAddress}`;
const auth = {
  pass: 'foo',
  user: '123',
};

interface CapturedRequest {
  init?: RequestInit;
  url: RequestInfo | URL;
}

const jsonResponse = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), {
    headers: { 'content-type': 'application/json' },
    status,
  });

// Builds a client backed by an injected fetcher driven by `handler`, and
// captures the requests the client makes so they can be asserted on. This
// replaces HTTP-level mocking: the handler returns the `Response` (or rejects)
// for each request.
const clientWith = (
  handler: (request: CapturedRequest) => Response | Promise<Response>,
  options: { host?: string; timeout?: number } = {}
) => {
  const requests: CapturedRequest[] = [];
  const fetcher = (async (url: RequestInfo | URL, init?: RequestInit) => {
    const request = { init, url };
    requests.push(request);
    return handler(request);
  }) as typeof fetch;
  const client = new Client(auth.user, auth.pass, { fetcher, ...options });
  return { client, requests };
};

const expectError = async (
  promise: Promise<unknown>,
  expected: {
    code: string;
    error: string;
    status?: number;
    url: string;
    // Whether the error's `cause` should be present or absent.
    cause?: 'defined' | 'undefined';
  }
): Promise<WebServiceError> => {
  const { cause, ...fields } = expected;
  const err = await promise.then(
    () => {
      throw new Error('expected the request to reject');
    },
    (e: unknown) => e
  );
  expect(err).toBeInstanceOf(WebServiceError);
  const webServiceError = err as WebServiceError;
  expect(webServiceError).toMatchObject(fields);
  // The `error` property is retained as an alias of `message`.
  expect(webServiceError.message).toBe(expected.error);
  // Assert `status` explicitly (toMatchObject ignores extra own properties),
  // so a regression leaking a `status` onto a network-error path is caught.
  expect(webServiceError.status).toBe(expected.status);
  if (cause === 'defined') {
    expect(webServiceError.cause).toBeDefined();
  }
  if (cause === 'undefined') {
    expect(webServiceError.cause).toBeUndefined();
  }
  return webServiceError;
};

describe('WebServiceClient', () => {
  describe('request', () => {
    it('uses the injected fetcher with the correct method, path, and auth', async () => {
      const ip = '8.8.8.8';
      const { client, requests } = clientWith(() =>
        jsonResponse(200, geoip2Fixture)
      );

      const got = await client.city(ip);

      expect(requests).toHaveLength(1);
      expect(requests[0].url).toBe(`${baseUrl}${fullPath('city', ip)}`);
      expect(requests[0].init!.method).toBe('GET');
      const headers = requests[0].init!.headers as Record<string, string>;
      expect(headers.Authorization).toBe(
        'Basic ' + btoa(`${auth.user}:${auth.pass}`)
      );
      expect(headers['User-Agent']).toMatch(/^GeoIP2-node\//);
      expect(got.country!.isoCode).toEqual('US');
    });
  });

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
      expect.assertions(97);

      const { client, requests } = clientWith(() =>
        jsonResponse(200, testFixture)
      );

      const got: models.City = await client.city(ip);

      expect(requests[0].url).toBe(`${baseUrl}${fullPath('city', ip)}`);

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
      expect.assertions(65);

      const { client, requests } = clientWith(() =>
        jsonResponse(200, testFixture)
      );

      const got: models.Country = await client.country(ip);

      expect(requests[0].url).toBe(`${baseUrl}${fullPath('country', ip)}`);

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
      anonymizer: geoip2Fixture.anonymizer,
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
      expect.assertions(107);

      const { client, requests } = clientWith(() =>
        jsonResponse(200, testFixture)
      );

      const got: models.Insights = await client.insights(ip);

      expect(requests[0].url).toBe(`${baseUrl}${fullPath('insights', ip)}`);

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
      expect(got.traits.ipRiskSnapshot).toEqual(42.5);
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

      expect(got.anonymizer!.confidence).toEqual(95);
      expect(got.anonymizer!.isAnonymous).toEqual(true);
      expect(got.anonymizer!.isAnonymousVpn).toEqual(true);
      expect(got.anonymizer!.isHostingProvider).toEqual(true);
      expect(got.anonymizer!.isPublicProxy).toEqual(false);
      expect(got.anonymizer!.isResidentialProxy).toEqual(false);
      expect(got.anonymizer!.isTorExitNode).toEqual(false);
      expect(got.anonymizer!.networkLastSeen).toEqual('2025-04-14');
      expect(got.anonymizer!.providerName).toEqual('NordVPN');
    });
  });

  describe('timeout handling', () => {
    it('should time out if the request takes too long', async () => {
      const ip = '8.8.8.8';

      // The handler never resolves on its own; it rejects only when the
      // request signal aborts, which the client's timeout triggers. This
      // exercises the real timeout signal and the NETWORK_TIMEOUT mapping
      // without depending on wall-clock response delays.
      const { client } = clientWith(
        (request) =>
          new Promise<Response>((_resolve, reject) => {
            request.init?.signal?.addEventListener('abort', () =>
              reject((request.init!.signal as AbortSignal).reason)
            );
          }),
        { timeout: 10 }
      );

      // The underlying abort/timeout error is preserved as the cause.
      await expectError(client.city(ip), {
        code: 'NETWORK_TIMEOUT',
        error: 'The request timed out',
        url: `${baseUrl}${fullPath('city', ip)}`,
        cause: 'defined',
      });
    });
  });

  describe('error handling', () => {
    it('rejects if the IP address is invalid', async () => {
      const ip = 'foo';
      const { client, requests } = clientWith(() =>
        jsonResponse(200, geoip2Fixture)
      );

      await expectError(client.city(ip), {
        code: 'IP_ADDRESS_INVALID',
        error: 'The IP address provided is invalid',
        url: baseUrl + fullPath('city', ip),
        cause: 'undefined',
      });
      // The request is rejected before any fetch is attempted.
      expect(requests).toHaveLength(0);
    });

    it('handles 5xx level errors', async () => {
      const ip = '8.8.8.8';
      const { client } = clientWith(() => new Response(null, { status: 500 }));

      await expectError(client.city(ip), {
        code: 'SERVER_ERROR',
        error: 'Received a server error with HTTP status code: 500',
        status: 500,
        url: baseUrl + fullPath('city', ip),
        cause: 'undefined',
      });
    });

    it('handles 3xx level errors', async () => {
      const ip = '8.8.8.8';
      const { client } = clientWith(() => new Response(null, { status: 300 }));

      await expectError(client.city(ip), {
        code: 'HTTP_STATUS_CODE_ERROR',
        error: 'Received an unexpected HTTP status code: 300',
        status: 300,
        url: baseUrl + fullPath('city', ip),
        cause: 'undefined',
      });
    });

    it('handles errors with unknown payload', async () => {
      const ip = '8.8.8.8';
      const { client } = clientWith(() => jsonResponse(401, { foo: 'bar' }));

      await expectError(client.city(ip), {
        code: 'INVALID_RESPONSE_BODY',
        error: 'Received an invalid or unparseable response body',
        status: 401,
        url: baseUrl + fullPath('city', ip),
        cause: 'undefined',
      });
    });

    test.each`
      description              | payload
      ${'a non-string code'}   | ${{ code: 123, error: 'an error' }}
      ${'a non-string error'}  | ${{ code: 'A_CODE', error: {} }}
      ${'empty string fields'} | ${{ code: '', error: '' }}
    `(
      'treats $description as an invalid response body',
      async ({ payload }) => {
        const ip = '8.8.8.8';
        const { client } = clientWith(() => jsonResponse(400, payload));

        await expectError(client.city(ip), {
          code: 'INVALID_RESPONSE_BODY',
          error: 'Received an invalid or unparseable response body',
          status: 400,
          url: baseUrl + fullPath('city', ip),
          cause: 'undefined',
        });
      }
    );

    it('handles 200s with bad json', async () => {
      const ip = '8.8.8.8';
      const { client } = clientWith(() => new Response('foo', { status: 200 }));

      const err = await expectError(client.city(ip), {
        code: 'INVALID_RESPONSE_BODY',
        error: 'Received an invalid or unparseable response body',
        url: baseUrl + fullPath('city', ip),
        cause: 'defined',
      });
      // The JSON parse error is preserved as the cause. (instanceof Error is
      // unreliable here: under --experimental-vm-modules the parse error is
      // created in a different realm than this test file.)
      expect((err.cause as Error).message).toEqual(expect.any(String));
    });

    it('preserves the cause when an error response body is not JSON', async () => {
      const ip = '8.8.8.8';
      const { client } = clientWith(
        () => new Response('this is not json', { status: 401 })
      );

      const err = await expectError(client.city(ip), {
        code: 'INVALID_RESPONSE_BODY',
        error: 'Received an invalid or unparseable response body',
        status: 401,
        url: baseUrl + fullPath('city', ip),
        cause: 'defined',
      });
      // The parse failure on a non-2xx response is preserved as the cause.
      expect((err.cause as Error).message).toEqual(expect.any(String));
    });

    it('handles general network errors', async () => {
      const ip = '8.8.8.8';
      const error = 'Network Error';
      const { client } = clientWith(() => Promise.reject(new Error(error)));

      const err = await expectError(client.city(ip), {
        code: 'FETCH_ERROR',
        error: `Error - ${error}`,
        url: baseUrl + fullPath('city', ip),
        cause: 'defined',
      });
      // The original fetch error is preserved as the cause.
      expect((err.cause as Error).message).toBe(error);
    });

    it('wraps a non-Error fetcher rejection', async () => {
      const ip = '8.8.8.8';
      // A custom fetcher (e.g. a proxy/dispatcher) may reject with a non-Error
      // value; it should still be normalized into a FETCH_ERROR.
      const { client } = clientWith(() => Promise.reject('boom'));

      const err = await expectError(client.city(ip), {
        code: 'FETCH_ERROR',
        error: 'Error - boom',
        url: baseUrl + fullPath('city', ip),
        cause: 'defined',
      });
      expect((err.cause as Error).message).toBe('boom');
    });

    it('includes the underlying cause in the FETCH_ERROR message', async () => {
      const ip = '8.8.8.8';
      const fetchError = Object.assign(new TypeError('fetch failed'), {
        cause: new Error('connect ECONNREFUSED 1.2.3.4:443'),
      });
      const { client } = clientWith(() => Promise.reject(fetchError));

      const err = await expectError(client.city(ip), {
        code: 'FETCH_ERROR',
        error: 'TypeError - fetch failed: connect ECONNREFUSED 1.2.3.4:443',
        url: baseUrl + fullPath('city', ip),
        cause: 'defined',
      });
      // The original error (with its own cause) is still attached.
      expect((err.cause as Error).message).toBe('fetch failed');
    });

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
    `('handles $code error', async ({ code, error, status }) => {
      const ip = '8.8.8.8';
      const { client } = clientWith(() =>
        jsonResponse(status, { code, error })
      );

      await expectError(client.city(ip), {
        code,
        error,
        status,
        cause: 'undefined',
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
