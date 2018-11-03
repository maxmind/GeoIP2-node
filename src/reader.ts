import mmdb = require('maxmind');
import ReaderModel from './readerModel';

/** Class representing the mmdb reader **/
export default class Reader {
  /**
   * Opens a mmdb file and returns a ReaderModel promise
   *
   * @example
   * ```typescript
   * Reader.open<ICityResponse>.then(reader => {
   *   const response = reader.city('123.123.123.123')
   *   console.log(response.city) // The city object (maxmind.ICity)
   *   console.log(response.country) // The country object (maxmind.ICountry)
   * });
   * ```
   *
   * @param file The file to open
   * @param opts Options for opening the file.  See https://github.com/runk/node-maxmind#options
   */
  public static open<T>(
    file: string,
    opts?: mmdb.IOpenOpts
  ): Promise<ReaderModel<T>> {
    return new Promise((resolve, reject) => {
      mmdb.open(file, opts, (err: Error, reader: mmdb.IReader<T>) => {
        if (err) {
          return reject(err);
        }
        return resolve(new ReaderModel<T>(reader));
      });
    });
  }
}
