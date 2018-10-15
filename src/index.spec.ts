import * as mockFs from 'mock-fs';
import GeoIP2 = require('./index');

describe('test', () => {
  beforeEach(() => {
    mockFs({
      './foo.txt': 'foobar',
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('foo', () => {
    expect.assertions(1);
    return expect(GeoIP2.open('./foo.txt')).resolves.toBeInstanceOf(Buffer);
  });
});
