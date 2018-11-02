import { cloneDeep } from 'lodash';
import mmdb = require('maxmind');
import * as fixture from '../fixtures/geoip2.json';
import { AddressNotFoundError, BadMethodCallError } from './errors';
import ReaderModel from './readerModel';

describe('ReaderModel', () => {
  describe('city()', () => {
    const cityFixture = {
      city: fixture.city,
      continent: fixture.continent as mmdb.IContinent,
      country: fixture.country,
      location: fixture.location,
      registered_country: fixture.registered_country,
      represented_country: fixture.represented_country,
      subdivisions: fixture.subdivisions,
      traits: fixture.traits as mmdb.ITraits,
    };

    const mmdbReader: mmdb.IReader = {
      get(ipAddress: string) {
        if (ipAddress === 'fail.fail') {
          return null;
        }
        return cityFixture;
      },
      metadata: {
        binaryFormatMajorVersion: 1,
        binaryFormatMinorVersion: 2,
        buildEpoch: new Date(),
        databaseType: 'GeoIP2-City-Super-Special',
        description: 'hello',
        ipVersion: 5,
        languages: ['en'],
        nodeByteSize: 1,
        nodeCount: 1,
        recordSize: 1,
        searchTreeSize: 1,
        treeDepth: 1,
      },
    };

    it('returns city data', () => {
      const cityInstance = new ReaderModel(mmdbReader);
      expect(cityInstance.city('123.123')).toEqual(cityFixture);
      expect(cityInstance.city('123.123').traits.ip_address).toEqual('123.123');
    });

    it('throws an error if db types do not match', () => {
      const errReader = cloneDeep(mmdbReader);
      errReader.metadata.databaseType = 'foo';

      const cityInstance = new ReaderModel(errReader);
      expect(() => cityInstance.city('123.123')).toThrow(BadMethodCallError);
    });

    it('throws an error if IP address is not in database', () => {
      const cityInstance = new ReaderModel(mmdbReader);
      expect(() => cityInstance.city('fail.fail')).toThrow(
        AddressNotFoundError
      );
    });
  });
});
