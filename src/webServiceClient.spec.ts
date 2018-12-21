import camelcaseKeys = require('camelcase-keys');
import mmdb = require('maxmind');
import nock = require('nock');
import * as geoip2Fixture from '../fixtures/geoip2.json';
import Client from './webServiceClient';

const baseUrl = 'https://geoip.maxmind.com';
const nockInstance = nock(baseUrl);
const fullPath = (path: string, ipAddress: string) =>
  `/geoip/v2.1/${path}/${ipAddress}`;
const auth = {
  pass: 'foo',
  user: '123',
};
const client = new Client(auth.user, auth.pass);

describe('WebServiceClient', () => {
  describe('city()', () => {
    const testFixture = {
      city: geoip2Fixture.city,
      continent: geoip2Fixture.continent as mmdb.ContinentRecord,
      country: geoip2Fixture.country,
      location: geoip2Fixture.location,
      maxmind: geoip2Fixture.maxmind,
      postal: geoip2Fixture.postal,
      registered_country: geoip2Fixture.registered_country,
      represented_country: geoip2Fixture.represented_country,
      subdivisions: geoip2Fixture.subdivisions,
      traits: geoip2Fixture.traits as mmdb.TraitsRecord,
    };

    it('returns a city class', () => {
      const ip = '8.8.8.8';
      expect.assertions(1);

      nockInstance
        .get(fullPath('city', ip))
        .basicAuth(auth)
        .reply(200, testFixture);

      return expect(client.city(ip)).resolves.toEqual(
        camelcaseKeys(testFixture, { deep: true, exclude: [/\-/] })
      );
    });
  });

  describe('country()', () => {
    const testFixture = {
      continent: geoip2Fixture.continent as mmdb.ContinentRecord,
      country: geoip2Fixture.country,
      maxmind: geoip2Fixture.maxmind,
      registered_country: geoip2Fixture.registered_country,
      represented_country: geoip2Fixture.represented_country,
      traits: geoip2Fixture.traits as mmdb.TraitsRecord,
    };

    it('returns a country class', () => {
      const ip = '8.8.8.8';
      expect.assertions(1);

      nockInstance
        .get(fullPath('country', ip))
        .basicAuth(auth)
        .reply(200, testFixture);

      return expect(client.country(ip)).resolves.toEqual(
        camelcaseKeys(testFixture, { deep: true, exclude: [/\-/] })
      );
    });
  });

  describe('insights()', () => {
    const testFixture = {
      city: geoip2Fixture.city,
      continent: geoip2Fixture.continent as mmdb.ContinentRecord,
      country: geoip2Fixture.country,
      location: geoip2Fixture.location,
      maxmind: geoip2Fixture.maxmind,
      postal: geoip2Fixture.postal,
      registered_country: geoip2Fixture.registered_country,
      represented_country: geoip2Fixture.represented_country,
      subdivisions: geoip2Fixture.subdivisions,
      traits: geoip2Fixture.traits as mmdb.TraitsRecord,
    };

    it('returns an insight class', () => {
      const ip = '8.8.8.8';
      expect.assertions(1);

      nockInstance
        .get(fullPath('insights', ip))
        .basicAuth(auth)
        .reply(200, testFixture);

      return expect(client.insights(ip)).resolves.toEqual(
        camelcaseKeys(testFixture, { deep: true, exclude: [/\-/] })
      );
    });
  });

  describe('error handling', () => {
    it('rejects if the IP address is invalid', () => {
      const ip = 'foo';
      expect.assertions(1);

      return expect(client.city(ip)).rejects.toEqual({
        code: 'IP_ADDRESS_INVALID',
        error: 'The IP address provided is invalid',
      });
    });

    it('handles 5xx level errors', () => {
      const ip = '8.8.8.8';
      expect.assertions(1);

      nockInstance
        .get(fullPath('city', ip))
        .basicAuth(auth)
        .reply(500);

      return expect(client.city(ip)).rejects.toEqual({
        code: 'SERVER_ERROR',
        message: 'Received a server error with HTTP status code: 500',
        url: baseUrl + fullPath('city', ip),
      });
    });

    it('handles 3xx level errors', () => {
      const ip = '8.8.8.8';
      expect.assertions(1);

      nockInstance
        .get(fullPath('city', ip))
        .basicAuth(auth)
        .reply(300);

      return expect(client.city(ip)).rejects.toEqual({
        code: 'HTTP_STATUS_CODE_ERROR',
        message: 'Received an unexpected HTTP status code: 300',
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
        message: 'Received an invalid or unparseable response body',
        url: baseUrl + fullPath('city', ip),
      });
    });

    it('handles general http.request errors', () => {
      const ip = '8.8.8.8';

      const error = {
        code: 'FOO_ERR',
        message: 'some foo error',
      };

      const expected = {
        code: error.code,
        error: error.message,
      };

      expect.assertions(1);

      nockInstance
        .get(fullPath('city', ip))
        .basicAuth(auth)
        .replyWithError(error);

      return expect(client.city(ip)).rejects.toEqual(expected);
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
