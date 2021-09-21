/* tslint:disable:max-classes-per-file */

/**
 * This error is thrown when the IP address is not found in the database.
 * This generally means that the address was a private or reserved address.
 */
export class AddressNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * This error is thrown if the database file and the reader method do not match.
 * e.g. `reader.city` is used with a Country database
 */
export class BadMethodCallError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * This error is thrown if a database buffer is not a valid database
 */
export class InvalidDbBufferError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * This error is thrown if the IP address provided is not valid.
 */
export class ValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
