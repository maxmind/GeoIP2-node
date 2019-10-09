import { Reader, WebServiceClient } from '@maxmind/geoip2-node';

describe('WebServiceClient', () => {
  it('exists', () => {
    const client = () => new WebServiceClient('1234', 'foo');

    expect(client).not.toThrowError();
  });
});

describe('Reader', () => {
  it('exists', async () => {
    expect.assertions(1);
    const response = await Reader.open('../GeoIP2-City-Test.mmdb');
    expect(response.city('175.16.199.1')).toHaveProperty('city.geonameId');
  });
});
