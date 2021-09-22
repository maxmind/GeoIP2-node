import * as fs from 'fs';
import mmdb = require('maxmind');
import { InvalidDbBufferError } from './errors';
import Reader from './reader';
import ReaderModel from './readerModel';

describe('Reader', () => {
  describe('open()', () => {
    const file = './test/data/test-data/GeoIP2-City-Test.mmdb';

    it('passes the file to node-maxmind and resolves', () => {
      const spy = jest.spyOn(mmdb, 'open');

      expect.assertions(2);

      return Reader.open(file).then((reader) => {
        expect(spy).toHaveBeenCalledWith(file, undefined);
        expect(reader).toBeInstanceOf(ReaderModel);
      });
    });

    it('passes the file and options to node-maxmind and resolves', () => {
      const spy = jest.spyOn(mmdb, 'open');
      const options = {
        cache: {
          max: 100,
        },
      };

      expect.assertions(2);

      return Reader.open(file, options).then((reader) => {
        expect(spy).toHaveBeenCalledWith(file, options);
        expect(reader).toBeInstanceOf(ReaderModel);
      });
    });

    it('rejects the promise if node-maxmind errors out', () => {
      return expect(Reader.open('fail.test')).rejects.toThrowError(
        "ENOENT: no such file or directory, open 'fail.test'"
      );
    });
  });

  describe('openBuffer()', () => {
    const file = './test/data/test-data/GeoIP2-City-Test.mmdb';

    it('returns a reader model if the buffer is a valid DB', async () => {
      const buffer = fs.readFileSync(file);
      expect(Reader.openBuffer(buffer)).toBeInstanceOf(ReaderModel);
    });

    describe('errors', () => {
      const openBufferFoo = () => Reader.openBuffer(Buffer.from('foo'));

      it('throws an InvalidDbBufferError if buffer is not a valid DB', () => {
        expect(openBufferFoo).toThrow(InvalidDbBufferError);
        expect(openBufferFoo).toThrow('Unknown type 109 at offset 1');
      });

      it('throws an InvalidDbBufferError if thrown error is a string', async () => {
        const message = 'foo message';

        const spy = jest.spyOn(mmdb, 'Reader').mockImplementation(() => {
          throw message;
        });

        expect(openBufferFoo).toThrow(InvalidDbBufferError);
        expect(openBufferFoo).toThrow(message);

        spy.mockRestore();
      });

      it('throws an InvalidDbBufferError if error is a not an Error instance or string', async () => {
        const spy = jest.spyOn(mmdb, 'Reader').mockImplementation(() => {
          throw 1;
        });

        expect(openBufferFoo).toThrow(InvalidDbBufferError);
        expect(openBufferFoo).toThrow(
          'There was an error parsing the mmdb buffer'
        );

        spy.mockRestore();
      });
    });
  });
});
