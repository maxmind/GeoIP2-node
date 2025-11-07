import { camelcaseKeys } from '../utils';
import { CityResponse, Json } from '../types';
import * as records from '../records';
import City from './City';

/** Class representing the model of an "Insights" response **/
export default class Insights extends City {
  /**
   * The anonymizer record for the requested IP address. This contains
   * information about VPN providers and other anonymizing services. This
   * record is only available from the GeoIP2 Insights web service.
   */
  public readonly anonymizer?: records.AnonymizerRecord;

  /**
   * Instantiates an "Insights" using fields from the response
   *
   * @param response The GeoIP2 response
   */
  public constructor(response: CityResponse) {
    super(response);

    const camelcaseResponse = camelcaseKeys(
      response as Json
    ) as unknown as Insights;

    this.anonymizer = this.setBooleanAnonymizer(camelcaseResponse.anonymizer);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private setBooleanAnonymizer(anonymizer: any) {
    if (!anonymizer) {
      return undefined;
    }

    const booleanTraits = [
      'isAnonymous',
      'isAnonymousVpn',
      'isHostingProvider',
      'isPublicProxy',
      'isResidentialProxy',
      'isTorExitNode',
    ];

    booleanTraits.forEach((trait) => {
      anonymizer[trait] = !!anonymizer[trait];
    });

    return anonymizer as records.AnonymizerRecord;
  }
}
