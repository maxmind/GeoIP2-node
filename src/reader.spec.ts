import * as fs from 'node:fs';
import { InvalidDbBufferError } from './errors.js';
import Reader from './reader.js';
import ReaderModel from './readerModel.js';

describe('Reader', () => {
  describe('open()', () => {
    const file = './test/data/test-data/GeoIP2-City-Test.mmdb';

    it('passes the file to node-maxmind and resolves', async () => {
      expect.assertions(1);

      const reader = await Reader.open(file);
      expect(reader).toBeInstanceOf(ReaderModel);
    });

    it('passes the file and options to node-maxmind and resolves', async () => {
      const options = {
        cache: {
          max: 100,
        },
      };

      expect.assertions(1);

      const reader = await Reader.open(file, options);
      expect(reader).toBeInstanceOf(ReaderModel);
    });

    it('rejects the promise if node-maxmind errors out', () => {
      return expect(Reader.open('fail.test')).rejects.toThrow(
        "ENOENT: no such file or directory, stat 'fail.test'"
      );
    });
  });

  describe('openBuffer()', () => {
    const file = './test/data/test-data/GeoIP2-City-Test.mmdb';

    it('returns a reader model if the buffer is a valid DB', () => {
      const buffer = fs.readFileSync(file);
      expect(Reader.openBuffer(buffer)).toBeInstanceOf(ReaderModel);
    });

    it('throws an InvalidDbBufferError if buffer is not a valid DB', () => {
      expect(() => Reader.openBuffer(Buffer.from('foo'))).toThrow(
        InvalidDbBufferError
      );
    });

    it('preserves the underlying error as the cause', () => {
      expect.assertions(3);

      try {
        Reader.openBuffer(Buffer.from('foo'));
      } catch (e) {
        expect(e).toBeInstanceOf(InvalidDbBufferError);
        const err = e as InvalidDbBufferError;
        expect(typeof err.message).toBe('string');
        expect(err.cause).toBeInstanceOf(Error);
      }
    });
  });
});
