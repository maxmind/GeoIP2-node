import * as fs from 'fs';

/** Class representing the GeoIP2-node library **/
class GeoIP2 {
  /**
   * Open an mmdb database file
   * @param filename - The mmdb database file to open
   */
  public static open(filename: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.readFile(filename, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }
}

export = GeoIP2;
