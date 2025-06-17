/* eslint-disable @typescript-eslint/no-require-imports */
const WebServiceClient = require('@maxmind/geoip2-node').WebServiceClient;
const Reader = require('@maxmind/geoip2-node').Reader;

describe('WebServiceClient', () => {
  it('exists', () => {
    const client = () => new WebServiceClient('1234', 'foo');

    expect(client).not.toThrow();
  });
});

describe('WebServiceClient with options', () => {
  it('exists', () => {
    const client = () => new WebServiceClient('1234', 'foo', {host:'geolite.info', timeout:1000});

    expect(client).not.toThrow();
  });
});


describe('Reader', () => {
  it('exists', async () => {
    expect.assertions(1);
    const response = await Reader.open('../../test/data/test-data/GeoIP2-City-Test.mmdb');
    expect(response.city('175.16.199.1')).toHaveProperty('city.geonameId');
  });
});
