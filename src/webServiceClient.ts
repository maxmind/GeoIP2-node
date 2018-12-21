import https = require('https');
import mmdb = require('maxmind');
import {
  AddressNotFoundError,
  AuthenticationError,
  HttpError,
  InvalidRequestError,
  OutOfQueriesError,
  PermissionError,
  ValueError,
} from './errors';
import * as models from './models';

type servicePaths = 'city' | 'country' | 'insights';

export default class WebServiceClient {
  private accountID: string;
  private licenseKey: string;

  public constructor(accountID: string, licenseKey: string) {
    this.accountID = accountID;
    this.licenseKey = licenseKey;
  }

  public city(ipAddress: string): Promise<models.City> {
    return this.responseFor<models.City>('city', ipAddress, models.City);
  }

  public country(ipAddress: string): Promise<models.Country> {
    return this.responseFor<models.Country>(
      'country',
      ipAddress,
      models.Country
    );
  }

  public insights(ipAddress: string): Promise<models.Insights> {
    return this.responseFor<models.Insights>(
      'insights',
      ipAddress,
      models.Insights
    );
  }

  private responseFor<T>(
    path: servicePaths,
    ipAddress: string,
    modelClass: any
  ): Promise<T> {
    if (!mmdb.validate(ipAddress)) {
      return Promise.reject(new ValueError(`${ipAddress} is invalid`));
    }

    const parsedPath = `/geoip/v2.1/${path}/${ipAddress}`;

    const options = {
      auth: `${this.accountID}:${this.licenseKey}`,
      host: 'geoip.maxmind.com',
      method: 'GET',
      path: parsedPath,
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, response => {
        let data = '';

        response.on('data', chunk => {
          data += chunk;
        });

        response.on('end', () => {
          try {
            data = JSON.parse(data);
          } catch {
            return reject(this.handleError({}, response, parsedPath));
          }

          if (
            response.statusCode &&
            (response.statusCode < 200 || response.statusCode >= 400)
          ) {
            return reject(this.handleError(data, response, parsedPath));
          }

          return resolve(new modelClass(data));
        });
      });
      req.on('error', err => {
        return reject(err);
      });

      req.end();
    });
  }

  private handleError(data?: any, response?: any, path?: string) {
    if (
      response.statusCode >= 500 ||
      !data.code ||
      !data.error ||
      response.statusCode < 400
    ) {
      return new HttpError(
        `Received a server error or an unexpected HTTP status. Status code: "${
          response.statusCode
        }", Path: "${path}"`
      );
    }

    switch (data.code) {
      case 'IP_ADDRESS_INVALID':
      case 'IP_ADDRESS_REQUIRED':
      case 'IP_ADDRESS_RESERVED':
      case 'IP_ADDRESS_NOT_FOUND':
        return new AddressNotFoundError(data.error);
      case 'AUTHORIZATION_INVALID':
      case 'LICENSE_KEY_REQUIRED':
      case 'USER_ID_REQUIRED':
        return new AuthenticationError(data.error);
      case 'OUT_OF_QUERIES':
        return new OutOfQueriesError(data.error);
      case 'PERMISSION_REQUIRED':
        return new PermissionError(data.error);
      default:
        return new InvalidRequestError(
          `Unknown error. Please report this error to MaxMind. Code: "${
            data.code
          }", Error: "${data.error}", Path: "${path}"`
        );
    }
  }
}
