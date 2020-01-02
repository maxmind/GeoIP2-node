const mmdb = require('maxmind');
jest.genMockFromModule('maxmind');

const reader = {
  get() {
    return {
      city: 'foo',
    };
  }
};

mmdb.open = (file, opts) => {
  if (file === 'success.test') {
    return Promise.resolve(reader);
  }

  return Promise.reject(new Error('some mocked error'));
};

module.exports = mmdb;
