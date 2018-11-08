const mmdb = require('maxmind');
jest.genMockFromModule('maxmind');

const reader = {
  get() {
    return {
      city: 'foo',
    };
  }
};

mmdb.open = (file, opts, cb) => {
  if (file === 'success.test') {
    return cb(null, reader)
  }

  return cb(new Error('some mocked error'));
};

module.exports = mmdb;
