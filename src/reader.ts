import mmdb = require('maxmind');
import { InvalidDbBufferError } from './errors';
import ReaderModel from './readerModel';

/** Class representing the mmdb reader **/
export default class Reader {
  /**
   * Opens a mmdb file and returns a ReaderModel promise
   *
   * @example
   * ```typescript
   * Reader.open('somefile.mmdb').then(reader => {
   *   const response = reader.city('123.123.123.123')
   *   console.log(response.city) // The city object (maxmind.CityField)
   *   console.log(response.country) // The country object (maxmind.CountryField)
   * });
   * ```
   *
   * @param file The file to open
   * @param opts Options for opening the file.  See https://github.com/runk/node-maxmind#options
   */
  public static open(file: string, opts?: mmdb.OpenOpts): Promise<ReaderModel> {
    return mmdb
      .open<mmdb.Response>(file, opts)
      .then((reader) => new ReaderModel(reader));
  }

  /**
   * Opens a buffer that contains mmdb data and returns a ReaderModel
   *
   * @param buffer The buffer to open
   */
  public static openBuffer(buffer: Buffer): ReaderModel {
    let reader;
    try {
      reader = new mmdb.Reader(buffer);
    } catch (e: unknown) {
      if (typeof e === 'string') {
        throw new InvalidDbBufferError(e);
      }

      if (e instanceof Error) {
        throw new InvalidDbBufferError(e.message);
      }

      throw new InvalidDbBufferError(
        'There was an error parsing the mmdb buffer'
      );
    }

    return new ReaderModel(reader);
  }
}
