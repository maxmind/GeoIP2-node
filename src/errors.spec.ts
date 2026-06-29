import {
  AddressNotFoundError,
  BadMethodCallError,
  InvalidDbBufferError,
  ValueError,
  WebServiceError,
} from './errors.js';

describe.each([
  ['AddressNotFoundError', AddressNotFoundError],
  ['BadMethodCallError', BadMethodCallError],
  ['InvalidDbBufferError', InvalidDbBufferError],
  ['ValueError', ValueError],
] as const)('%s', (name, ErrorClass) => {
  it('uses the message and sets the name', () => {
    const err = new ErrorClass('boom');

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ErrorClass);
    expect(err.message).toBe('boom');
    expect(err.name).toBe(name);
  });

  it('preserves the underlying cause when provided', () => {
    const cause = new TypeError('underlying');
    const err = new ErrorClass('boom', { cause });

    expect(err.cause).toBe(cause);
  });

  it('leaves cause undefined when not provided', () => {
    const err = new ErrorClass('boom');

    expect(err.cause).toBeUndefined();
  });
});

describe('WebServiceError', () => {
  it('is an Error instance', () => {
    const err = new WebServiceError({
      code: 'FETCH_ERROR',
      error: 'something went wrong',
      url: 'https://example.com',
    });

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(WebServiceError);
    expect(err.name).toBe('WebServiceError');
  });

  it('exposes code, error, status, and url', () => {
    const err = new WebServiceError({
      code: 'SERVER_ERROR',
      error: 'boom',
      status: 500,
      url: 'https://example.com',
    });

    expect(err.code).toBe('SERVER_ERROR');
    expect(err.error).toBe('boom');
    expect(err.status).toBe(500);
    expect(err.url).toBe('https://example.com');
  });

  it('uses the error string as the message', () => {
    const err = new WebServiceError({
      code: 'FETCH_ERROR',
      error: 'the message',
      url: 'https://example.com',
    });

    expect(err.message).toBe('the message');
    expect(err.error).toBe(err.message);
  });

  it('preserves the underlying cause', () => {
    const cause = new TypeError('fetch failed');
    const err = new WebServiceError(
      {
        code: 'FETCH_ERROR',
        error: 'TypeError - fetch failed',
        url: 'https://example.com',
      },
      { cause }
    );

    expect(err.cause).toBe(cause);
  });

  it('leaves cause undefined when not provided', () => {
    const err = new WebServiceError({
      code: 'FETCH_ERROR',
      error: 'something went wrong',
      url: 'https://example.com',
    });

    expect(err.cause).toBeUndefined();
    expect(JSON.parse(JSON.stringify(err))).not.toHaveProperty('cause');
  });

  it('omits status when not provided', () => {
    const err = new WebServiceError({
      code: 'FETCH_ERROR',
      error: 'something went wrong',
      url: 'https://example.com',
    });

    expect(err.status).toBeUndefined();
    expect(Object.prototype.hasOwnProperty.call(err, 'status')).toBe(false);
  });

  it('retains code, error, status, and url as enumerable properties', () => {
    const err = new WebServiceError({
      code: 'SERVER_ERROR',
      error: 'boom',
      status: 500,
      url: 'https://example.com',
    });

    const serialized = JSON.parse(JSON.stringify(err));
    expect(serialized).toMatchObject({
      code: 'SERVER_ERROR',
      error: 'boom',
      status: 500,
      url: 'https://example.com',
    });
    // `name` lives on the prototype, so it is not serialized.
    expect(serialized).not.toHaveProperty('name');
  });
});
