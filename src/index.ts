import * as fs from 'fs';

class GeoIP2 {
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
