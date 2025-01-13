CHANGELOG
=========

6.0.0
------------------

* **Breaking** Internal webservice calls now use Node's built-in `fetch` instead of `http`.  This
  will affect users who are on unsupported versions of Node, specifically Node 17 and below.
* Two new error codes have been added: `NETWORK_TIMEOUT` and `FETCH_ERROR`, second of which is returned
  when there's a `fetch` related error that could not be handled by other errors.
* The `ip6addr` dependency has been removed.
* `metroCode` on `LocationRecord` has been marked deprecated. The code values
  are no longer being updated.

5.0.0 (2023-12-05)
------------------

* **Breaking** Drop node 16 support
* The `isAnycast` attribute was added to `TraitsRecord`. This is `true` if
  the IP address belongs to an [anycast
  network](https://en.wikipedia.org/wiki/Anycast). This is available for the
  GeoIP2 Country, City Plus, and Insights web services and the GeoIP2 Country,
  City, and Enterprise databases.
* The boolean attributes on the record models are no longer optional. We
  set missing values to false during construction.

4.2.0 (2023-07-27)
------------------

* Added `Satellite` to `ConnectionType` type.

4.1.0 (2023-06-30)
------------------

* Update dependencies. Fixes issue #911

4.0.0 (2023-05-16)
------------------

* **Breaking** Drop Node 14 support

3.5.0 (2022-10-28)
------------------

* `consumer_privacy_network` was added to the type union for the `userType`
  property in the `TraitsRecord` interface.
* Address lodash security vulnerability.

3.4.0 (2022-01-11)
------------------

* Upgrade dependencies
* Support for mobile country code (MCC) and mobile network codes (MNC) was
  added for the GeoIP2 ISP and Enterprise databases as well as the GeoIP2
  City Plus and Insights web services. `mobileCountryCode` and
  `mobileNetworkCode` attributes were added to `Isp` for the GeoIP2 ISP
  database and `TraitsRecord` for the Enterprise database and the GeoIP2
  City Plus and Insights web services. We expect this data to be available
  by late January, 2022.

3.3.0 (2021-11-29)
------------------

* Upgrade yarn dependencies

3.2.0 (2021-08-17)
------------------

* Upgrade yarn dependencies

3.1.0 (2021-07-08)
------------------

* Upgrade yarn dependencies

3.0.0 (2021-06-03)
------------------

* **Breaking** Drop node 10 support
* Upgrade yarn dependencies

2.3.2 (2021-04-13)
------------------

* The `staticIpScore` property was incorrectly spelled `staticIPScore`.
  This is now fixed. Reported by griffyn-showit. GitHub #402.
* Upgrade yarn dependencies

2.3.1 (2021-03-17)
------------------

* Upgrade yarn dependencies

2.2.1 (2021-02-12)
------------------

* Upgrade yarn dependencies

2.1.1 (2021-01-18)
------------------

* Upgrade yarn dependencies

2.1.0 (2021-01-05)
------------------

* The `WebServiceClient` class now accepts an options object as the third
  parameter. The currently valid options are `timeout` and `host`. To use the
  GeoLite2 web service instead of GeoIP2 Precision, set `host` to
  `geolite.info`. If you were previously passing the timeout as the third
  parameter, this is deprecated and you should transition to passing it in
  the options object.

2.0.0 (2020-11-02)
------------------

### Breaking change

* `country` and `city` values return `undefined` instead of `{}` when empty.

1.6.0 (2020-09-29)
------------------

* Add the `isResidentialProxy` property to `AnonymousIP` and `TraitsRecord`
  for use with the Anonymous IP database and GeoIP2 Precision Insights.

1.5.0 (2020-08-07)
------------------

* Add `connection-type` to traits (Enterprise database)
* Add API ts-doc documentation

1.4.0 (2020-01-07)
------------------

* **Drop support for Node 8.**
* A `network` property has been added to the various response models. This
  represents the largest network where all the fields besides the IP address
  are the same.
* Add the `userCount` property to `TraitsRecord`. This is an integer which
  indicates the estimated number of users sharing the IP/network during the
  past 24 hours. This output is available from GeoIP2 Precision Insights.
* Add the `staticIpScore` property to `TraitsRecord`. This is
  a float which indicates how static or dynamic an IP address is. This
  output is available from GeoIP2 Precision Insights.

1.3.0 (2019-09-25)
------------------

* Upgrade yarn dependencies

1.2.0 (2020-09-19)
------------------

* Upgrade yarn dependencies

1.1.1 (2020-09-03)
------------------

* Fix path to types. GitHub #53.

1.1.0 (2020-09-03)
------------------

* Upgrade yarn dependencies

1.0.0 (2019-08-22)
------------------

* Fix user-agent header in request
* Point package.json's main to dist/src/index.js

0.6.0 (2019-06-04)
------------------

* Fix incorrect readerModel return type for country
* Update yarn.lock modules

0.5.0 (2019-04-15)
------------------

* Update yarn.lock modules

0.4.0 (2018-01-11)
------------------

* Drop support for Node 6.
* Fix export of models and record interfaces.

0.3.0 (2018-01-02)
------------------

* Add web service API support.

0.2.1 (2018-12-27)
------------------

* Fix Buffer documentation.

0.2.0 (2018-12-21)
------------------

* Add ability to use Buffers instead of local db file.

0.1.1 (2018-11-20)
------------------

* Fix release script.

0.1.0 (2018-11-16)
------------------

* Initial release.
