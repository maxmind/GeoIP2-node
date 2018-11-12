# MaxMind GeoIP2 Node.js API

[![Build Status](https://api.travis-ci.com/maxmind/GeoIP2-node.svg?branch=master)](https://travis-ci.com/maxmind/GeoIP2-node)
[![Known Vulnerabilities](https://snyk.io/test/github/maxmind/GeoIP2-node/badge.svg)](https://snyk.io/test/github/maxmind/GeoIP2-node)

## Database Reader

### City Example

```
const reader = require('GeoIP2-node').Reader;

Reader.open('/usr/local/share/GeoIP/GeoIP2-City.mmdb').then(reader => {
  const response = reader.city('128.101.101.101');

  console.log(response.country.isoCode); // 'US'
});

```
### ASN Example

```
const reader = require('GeoIP2-node').Reader;

Reader.open('/usr/local/share/GeoIP/GeoLite2-ASN.mmdb').then(reader => {
  const response = reader.asn('128.101.101.101');

  console.log(response.autonomous_system_number); // 217
  console.log(response.autonomous_system_organization); // 'University of Minnesota'
});

```

### ISP Example

```
const reader = require('GeoIP2-node').Reader;

Reader.open('/usr/local/share/GeoIP/GeoIP2-ISP.mmdb').then(reader => {
  const response = reader.isp('128.101.101.101');

  console.log(response.autonomous_system_number); // 217
  console.log(response.autonomous_system_organization); // 'University of Minnesota'
  console.log(response.isp); // 'University of Minnesota'
  console.log(response.organization); // 'University of Minnesota'

  console.log(response.ip_address); // '128.101.101.101'
});

```

### Connection-Type Example

```
const reader = require('GeoIP2-node').Reader;

Reader.open('/usr/local/share/GeoIP/GeoIP2-Connection-Type.mmdb').then(reader => {
  const response = reader.connectionType('128.101.101.101');

  console.log(response.connection_type) // 'Cable/DSL'
  console.log(response.ip_address) // '128.101.101.101'
});

```

## Copyright and License ##

This software is Copyright (c) 2018 by MaxMind, Inc.

This is free software, licensed under the Apache License, Version 2.0.
