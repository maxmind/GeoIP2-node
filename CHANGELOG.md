CHANGELOG
=========

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
