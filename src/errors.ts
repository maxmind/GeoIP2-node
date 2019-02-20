/* tslint:disable:max-classes-per-file */
export class AddressNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class BadMethodCallError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidDbBufferError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
