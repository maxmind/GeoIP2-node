import * as mmdb from 'maxmind';
import { version } from '../package.json';
import * as models from './models';
import { WebServiceClientError } from './types';

/** Option for the WebServiceClient constructor */
interface Options {
  /** The host to use when connecting to the web service. The default is
   *  "geoip.maxmind.com". To call the GeoLite2 web service instead of the
   *  GeoIP2 web service, set this to "geolite.info". To call the Sandbox
   *  GeoIP2 web service instead of the production GeoIP2 web service, set this
   *  to "sandbox.maxmind.com". The sandbox allows you to experiment with the
   *  API without affecting your production data.
   */
  host?: string;
  /** The timeout. The default is 3000 */
  timeout?: number;
}
interface ResponseError {
  code?: string;
  error?: string;
}
type servicePath = 'city' | 'country' | 'insights';

/** Class representing the WebServiceClient **/
export default class WebServiceClient {
  private accountID: string;
  private licenseKey: string;
  private timeout = 3000;
  private host = 'geoip.maxmind.com';

  /**
   * Instantiates a WebServiceClient
   *
   * @param accountID The account ID
   * @param licenseKey The license key
   * @param options Additional option to use when connecting to the web
   *                service. If you pass a number as the third parameter, it
   *                will be treated as the timeout; however, passing in a number
   *                should be considered deprecated and may be removed in a
   *                future major version.
   * @param host The host to use. The default is "geoip.maxmind.com". To call
   *             the GeoLite2 web service instead of the GeoIP2 web service, use
   *             "geolite.info".
   */
  public constructor(
    accountID: string,
    licenseKey: string,
    // We support a number, which will be treated as the timeout for historical
    // reasons.
    options?: Options | number
  ) {
    this.accountID = accountID;
    this.licenseKey = licenseKey;
    if (options === undefined) {
      return;
    }

    if (typeof options === 'object') {
      if (options.host !== undefined) {
        this.host = options.host;
      }

      if (options.timeout !== undefined) {
        this.timeout = options.timeout;
      }
      return;
    }

    this.timeout = options;
  }

  /**
   * Returns a Promise with the City Plus data for an IP address.
   *
   * @param ipAddress The IP Address you want to query the City Plus web
   * service with
   */
  public city(ipAddress: string): Promise<models.City> {
    return this.responseFor<models.City>('city', ipAddress, models.City);
  }

  /**
   * Returns a Promise with the Country data for an IP address.
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
   * Returns a Promise with the Insights data for an IP address.
   *
   * Insights is only supported by the GeoIP2 web service. It is not supported
   * by the GeoLite2 web service.
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    const options: RequestInit = {
      headers: {
        Accept: 'application/json',
        Authorization:
          'Basic ' +
          Buffer.from(`${this.accountID}:${this.licenseKey}`).toString(
            'base64',
          ),
        'User-Agent': `GeoIP2-node/${version}`,
      },
      method: 'GET',
      signal: controller.signal,
    };

    return new Promise((resolve, reject) => {
      return fetch(url, options)
        .then(async (response) => {
          clearTimeout(timeoutId);
          let data;
          try {
            data = await response.json();
          } catch {
            return reject(this.handleError({}, response, url));
          }

          if (response.status && response.status !== 200) {
            return reject(
              this.handleError(data as ResponseError, response, url),
            );
          }

          return resolve(new modelClass(data));
        })
        .catch((err: NodeJS.ErrnoException) => {
          if (err.name === 'AbortError') {
          clearTimeout(timeoutId);
            return reject({
              code: 'FETCH_TIMEOUT',
              error: 'The request timed out',
              url,
            } as WebServiceClientError);
          }
          return reject({
            code: err.code,
            error: err.message,
            url,
          } as WebServiceClientError);
        });
    });
  }

  private handleError(
    data: ResponseError,
    response: Response,
    url: string,
  ): WebServiceClientError {
    if (response.status && response.status >= 500 && response.status < 600) {
      return {
        code: 'SERVER_ERROR',
        error: `Received a server error with HTTP status code: ${response.status}`,
        url,
      };
    }

    if (response.status && (response.status < 400 || response.status >= 600)) {
      return {
        code: 'HTTP_STATUS_CODE_ERROR',
        error: `Received an unexpected HTTP status code: ${response.status}`,
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
