import http = require('http');
import https = require('https');
import mmdb = require('maxmind');
import { version } from '../package.json';
import * as models from './models';
import { WebServiceClientError } from './types';

interface ResponseError {
  code?: string;
  error?: string;
}
type servicePath = 'city' | 'country' | 'insights';

/** Class representing the WebServiceClient **/
export default class WebServiceClient {
  private accountID: string;
  private licenseKey: string;
  private timeout: number;
  private host: string;

  /**
   * Instantiates a WebServiceClient
   *
   * @param accountID The account ID
   * @param licenseKey The license key
   */
  public constructor(
    accountID: string,
    licenseKey: string,
    timeout?: number,
    host?: string
  ) {
    this.accountID = accountID;
    this.licenseKey = licenseKey;
    this.timeout = timeout || 3000;
    this.host = host || 'geoip.maxmind.com';
  }

  /**
   * Returns a Promise with the City Precision data for an IP address.
   *
   * @param ipAddress The IP Address you want to query the City web service with
   */
  public city(ipAddress: string): Promise<models.City> {
    return this.responseFor<models.City>('city', ipAddress, models.City);
  }

  /**
   * Returns a Promise with the Country Precision data for an IP address.
   *
   * @param ipAddress The IP Address you want to query the Country web service with
   */
  public country(ipAddress: string): Promise<models.Country> {
    return this.responseFor<models.Country>(
      'country',
      ipAddress,
      models.Country
    );
  }

  /**
   * Returns a Promise with the Insights Precision data for an IP address.
   *
   * @param ipAddress The IP Address you want to query the Insights web service with
   */
  public insights(ipAddress: string): Promise<models.Insights> {
    return this.responseFor<models.Insights>(
      'insights',
      ipAddress,
      models.Insights
    );
  }

  private responseFor<T>(
    path: servicePath,
    ipAddress: string,
    modelClass: any
  ): Promise<T> {
    const parsedPath = `/geoip/v2.1/${path}/${ipAddress}`;
    const url = `https://${this.host}${parsedPath}`;

    if (!mmdb.validate(ipAddress)) {
      return Promise.reject({
        code: 'IP_ADDRESS_INVALID',
        error: 'The IP address provided is invalid',
        url,
      } as WebServiceClientError);
    }

    const options = {
      auth: `${this.accountID}:${this.licenseKey}`,
      headers: {
        Accept: 'application/json',
        'User-Agent': `GeoIP2-node/${version}`,
      },
      host: this.host,
      method: 'GET',
      path: parsedPath,
      timeout: this.timeout,
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          try {
            data = JSON.parse(data);
          } catch {
            return reject(this.handleError({}, response, url));
          }

          if (response.statusCode && response.statusCode !== 200) {
            return reject(
              this.handleError(data as ResponseError, response, url)
            );
          }

          return resolve(new modelClass(data));
        });
      });
      req.on('error', (err: NodeJS.ErrnoException) => {
        return reject({
          code: err.code,
          error: err.message,
          url,
        } as WebServiceClientError);
      });

      req.end();
    });
  }

  private handleError(
    data: ResponseError,
    response: http.IncomingMessage,
    url: string
  ): WebServiceClientError {
    if (
      response.statusCode &&
      response.statusCode >= 500 &&
      response.statusCode < 600
    ) {
      return {
        code: 'SERVER_ERROR',
        error: `Received a server error with HTTP status code: ${response.statusCode}`,
        url,
      };
    }

    if (
      response.statusCode &&
      (response.statusCode < 400 || response.statusCode >= 600)
    ) {
      return {
        code: 'HTTP_STATUS_CODE_ERROR',
        error: `Received an unexpected HTTP status code: ${response.statusCode}`,
        url,
      };
    }

    if (!data.code || !data.error) {
      return {
        code: 'INVALID_RESPONSE_BODY',
        error: 'Received an invalid or unparseable response body',
        url,
      };
    }

    return { ...data, url } as WebServiceClientError;
  }
}
