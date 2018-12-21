import camelcaseKeys = require('camelcase-keys');
import mmdb = require('maxmind');
import nock = require('nock');
import * as geoip2Fixture from '../fixtures/geoip2.json';
import {
  AddressNotFoundError,
  AuthenticationError,
  HttpError,
  InvalidRequestError,
  OutOfQueriesError,
  PermissionError,
  ValueError,
} from './errors';
import Client from './webServiceClient';

const nockInstance = nock('https://geoip.maxmind.com');
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

      return expect(client.city(ip)).rejects.toEqual(
        new ValueError(`${ip} is invalid`)
      );
    });

    it('handles 5xx level errors', () => {
      const ip = '8.8.8.8';
      expect.assertions(1);

      nockInstance
        .get(fullPath('city', ip))
        .basicAuth(auth)
        .reply(500);

      return expect(client.city(ip)).rejects.toEqual(
        new HttpError(
          `Received a server error or an unexpected HTTP status. Status code: "500", Path: "${fullPath(
            'city',
            ip
          )}"`
        )
      );
    });

    it('handles errors with unknown payload', () => {
      const ip = '8.8.8.8';
      expect.assertions(1);

      nockInstance
        .get(fullPath('city', ip))
        .basicAuth(auth)
        .reply(401, { foo: 'bar' });

      return expect(client.city(ip)).rejects.toEqual(
        new HttpError(
          `Received a server error or an unexpected HTTP status. Status code: "401", Path: "${fullPath(
            'city',
            ip
          )}"`
        )
      );
    });

    it('handles general http.request errors', () => {
      const ip = '8.8.8.8';
      expect.assertions(1);

      nockInstance
        .get(fullPath('city', ip))
        .basicAuth(auth)
        .replyWithError('some generic error');

      return expect(client.city(ip)).rejects.toEqual(
        new Error('some generic error')
      );
    });

    it('handles errors with unknown code', () => {
      const ip = '8.8.8.8';
      expect.assertions(1);

      nockInstance
        .get(fullPath('city', ip))
        .basicAuth(auth)
        .reply(401, { code: 'bar', error: 'foo' });

      return expect(client.city(ip)).rejects.toEqual(
        new HttpError(
          `Unknown error. Please report this error to MaxMind. Code: "bar", Error: "foo", Path: "${fullPath(
            'city',
            ip
          )}"`
        )
      );
    });

    test.each`
      status | code                       | error                     | errorType
      ${400} | ${'IP_ADDRESS_INVALID'}    | ${'ip address invalid'}   | ${AddressNotFoundError}
      ${400} | ${'IP_ADDRESS_REQUIRED'}   | ${'ip address required'}  | ${AddressNotFoundError}
      ${400} | ${'IP_ADDRESS_RESERVED'}   | ${'ip address reserved'}  | ${AddressNotFoundError}
      ${404} | ${'IP_ADDRESS_NOT_FOUND'}  | ${'ip address not found'} | ${AddressNotFoundError}
      ${401} | ${'AUTHORIZATION_INVALID'} | ${'auth required'}        | ${AuthenticationError}
      ${401} | ${'LICENSE_KEY_REQUIRED'}  | ${'license key required'} | ${AuthenticationError}
      ${401} | ${'USER_ID_REQUIRED'}      | ${'user id required'}     | ${AuthenticationError}
      ${402} | ${'OUT_OF_QUERIES'}        | ${'out of queries'}       | ${OutOfQueriesError}
      ${403} | ${'PERMISSION_REQUIRED'}   | ${'permission required'}  | ${PermissionError}
    `('handles $code error', ({ code, error, errorType, status }) => {
      const ip = '8.8.8.8';

      nockInstance
        .get(fullPath('city', ip))
        .basicAuth(auth)
        .reply(status, { code, error });
      expect.assertions(1);

      return expect(client.city(ip)).rejects.toEqual(new errorType(error));
    });
  });
});
