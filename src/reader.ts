import * as mmdb from 'maxmind';
import { InvalidDbBufferError } from './errors.js';
import ReaderModel from './readerModel.js';

/** Class representing the mmdb reader **/
export default class Reader {
  /**
   * Opens a mmdb file and returns a ReaderModel promise
   *
   * @example
   * ```typescript
   * const reader = await Reader.open('somefile.mmdb');
   * const response = reader.city('123.123.123.123');
   * console.log(response.city) // The city object (maxmind.CityField)
   * console.log(response.country) // The country object (maxmind.CountryField)
   * ```
   *
   * @param file The file to open
   * @param opts Options for opening the file.  See https://github.com/runk/node-maxmind#options
   */
  public static async open(
    file: string,
    opts?: mmdb.OpenOpts
  ): Promise<ReaderModel> {
    return new ReaderModel(await mmdb.open(file, opts));
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
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      throw new InvalidDbBufferError(error.message, { cause: error });
    }

    return new ReaderModel(reader);
  }
}
