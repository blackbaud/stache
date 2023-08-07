# Changelog

## [9.0.0-alpha.0](https://github.com/blackbaud/stache/compare/8.1.0...9.0.0-alpha.0) (2023-08-07)


### ⚠ BREAKING CHANGES

* drop support for Angular 15; add support for Angular 16 ([#77](https://github.com/blackbaud/stache/issues/77))

### Features

* drop support for Angular 15; add support for Angular 16 ([#77](https://github.com/blackbaud/stache/issues/77)) ([1d1d7db](https://github.com/blackbaud/stache/commit/1d1d7dbcdece12a1514f31cd90b426fc2ced9f2d))

### Bug Fixes

* **stache:** set correct component URL for edit button ([#75](https://github.com/blackbaud/stache/issues/75)) ([42903c0](https://github.com/blackbaud/stache/commit/42903c024eb33d7edaa531e553e9c4cd4924c9b1))

## [8.1.1](https://github.com/blackbaud/stache/compare/8.1.0...8.1.1) (2023-08-03)


### Bug Fixes

* **stache:** set correct component URL for edit button ([#74](https://github.com/blackbaud/stache/issues/74)) ([cb9dab5](https://github.com/blackbaud/stache/commit/cb9dab514f6696682a05090a836da0f7aa98c5b8))

## [8.1.0](https://github.com/blackbaud/stache/compare/8.0.0...8.1.0) (2023-05-26)


### Features

* **stache:** allow `StacheRouteOptions` to be provided with navigation information for lazy loaded components ([#68](https://github.com/blackbaud/stache/issues/68)) Thanks @Blackbaud-NicklausGlyder! ([90f57eb](https://github.com/blackbaud/stache/commit/90f57eb04d249387084cb7065c342ab4573a5c16))

## [8.0.0](https://github.com/blackbaud/stache/compare/8.0.0-rc.2...8.0.0) (2023-05-10)


### ⚠ BREAKING CHANGES

* drop support for Angular 14 ([#46](https://github.com/blackbaud/stache/issues/46))
* **stache:** set `StacheJsonDataService` as provided in 'root' ([#39](https://github.com/blackbaud/stache/issues/39))
* **stache:** remove markdown and includes components ([#41](https://github.com/blackbaud/stache/issues/41))

### Features

* add support for Angular 15 ([#46](https://github.com/blackbaud/stache/issues/46)) ([b19ab3e](https://github.com/blackbaud/stache/commit/b19ab3e2310a33dd355db5440ff883e9aadd249e))
* update route metadata service to read from router module ([#25](https://github.com/blackbaud/stache/issues/25)) ([1f6d19b](https://github.com/blackbaud/stache/commit/1f6d19b2d69c85b24faec4a60ff76a2534c57fa8))
* **clipboard:** add strict-mode support, remove 'clipboard-polyfill' ([#6](https://github.com/blackbaud/stache/issues/6)) ([65db2fc](https://github.com/blackbaud/stache/commit/65db2fc2377e3c1b585f1b0f90a429ab4a6ef437))
* **code-block:** add strict-mode support ([#7](https://github.com/blackbaud/stache/issues/7)) ([92d20c0](https://github.com/blackbaud/stache/commit/92d20c08245850b12945210983877d359489a208))
* **stache:** set `StacheJsonDataService` as provided in 'root' ([#39](https://github.com/blackbaud/stache/issues/39)) ([03d905c](https://github.com/blackbaud/stache/commit/03d905c6c52413ceda70fa9e014ddc86f357fe01))
* **stache:** remove markdown and includes components ([#41](https://github.com/blackbaud/stache/issues/41)) ([27ae4ac](https://github.com/blackbaud/stache/commit/27ae4ac5f7ca8859beab13990afdcbe2c7379e7b))

### Bug Fixes

* add support for `rxjs@6` ([#31](https://github.com/blackbaud/stache/issues/31)) ([733bfb3](https://github.com/blackbaud/stache/commit/733bfb33b7f74dc0caca97118ecab30ef06d903a))
* **stache:** fix the StacheRouteService to handle child routes of a single root route ([#33](https://github.com/blackbaud/stache/issues/33)) ([7bbd9a6](https://github.com/blackbaud/stache/commit/7bbd9a646e2420360d18e0c289b9f15afff8d2f9))
* **stache:** recursively look for child routes when locating root path ([#37](https://github.com/blackbaud/stache/issues/37)) ([b9c455e](https://github.com/blackbaud/stache/commit/b9c455e73dcfbae8b41b17001b95810dc14e89b6))
* **stache:** add input converters back to inputs ([#51](https://github.com/blackbaud/stache/issues/51)) ([522e173](https://github.com/blackbaud/stache/commit/522e173a9058d6fea868feb9a6af5b1bc9e7250c))
* **stache:** convert component inputs when the inputs use an internal setter ([#58](https://github.com/blackbaud/stache/issues/58)) ([65287ad](https://github.com/blackbaud/stache/commit/65287ad64deca151083ba8f13db3640d637c54b0))

## [8.0.0-rc.2](https://github.com/blackbaud/stache/compare/8.0.0-rc.1...8.0.0-rc.2) (2023-03-15)


### Bug Fixes

* **stache:** convert component inputs when the inputs use an internal setter ([#58](https://github.com/blackbaud/stache/issues/58)) ([#60](https://github.com/blackbaud/stache/issues/60)) ([8e61bfd](https://github.com/blackbaud/stache/commit/8e61bfdf03c9e16e60d38bf74dc01f0cde4b4ecd))

## [8.0.0-beta.2](https://github.com/blackbaud/stache/compare/8.0.0-beta.1...8.0.0-beta.2) (2023-03-15)


### Bug Fixes

* **stache:** convert component inputs when the inputs use an internal setter ([#58](https://github.com/blackbaud/stache/issues/58)) ([65287ad](https://github.com/blackbaud/stache/commit/65287ad64deca151083ba8f13db3640d637c54b0))

## [8.0.0-rc.1](https://github.com/blackbaud/stache/compare/8.0.0-rc.0...8.0.0-rc.1) (2023-02-23)


### Bug Fixes

* **stache:** add input converters back to inputs ([#51](https://github.com/blackbaud/stache/issues/51)) ([#53](https://github.com/blackbaud/stache/issues/53)) ([6ba2b6b](https://github.com/blackbaud/stache/commit/6ba2b6b120c6084f3755e1c3ffacd9c33e1f3042))

## [8.0.0-beta.1](https://github.com/blackbaud/stache/compare/8.0.0-beta.0...8.0.0-beta.1) (2023-02-23)


### Bug Fixes

* **stache:** add input converters back to inputs ([#51](https://github.com/blackbaud/stache/issues/51)) ([522e173](https://github.com/blackbaud/stache/commit/522e173a9058d6fea868feb9a6af5b1bc9e7250c))

## [8.0.0-rc.0](https://github.com/blackbaud/stache/compare/8.0.0-beta.0...8.0.0-rc.0) (2023-02-22)


### ⚠ BREAKING CHANGES

* support Angular 15 ([#46](https://github.com/blackbaud/stache/issues/46))

### Features

* support Angular 15 ([#46](https://github.com/blackbaud/stache/issues/46)) ([b19ab3e](https://github.com/blackbaud/stache/commit/b19ab3e2310a33dd355db5440ff883e9aadd249e))

## [8.0.0-beta.0](https://github.com/blackbaud/stache/compare/8.0.0-alpha.6...8.0.0-beta.0) (2023-02-10)


### Features

* add support for SKY UX 7.6.1 ([#44](https://github.com/blackbaud/stache/issues/44)) ([38aa982](https://github.com/blackbaud/stache/commit/38aa98263ec111c99b9764d1d249e294785cc871))

## [8.0.0-alpha.6](https://github.com/blackbaud/stache/compare/8.0.0-alpha.5...8.0.0-alpha.6) (2023-02-06)


### ⚠ BREAKING CHANGES

* **stache:** remove markdown and includes components ([#41](https://github.com/blackbaud/stache/issues/41))

### Features

* **stache:** remove markdown and includes components ([#41](https://github.com/blackbaud/stache/issues/41)) ([27ae4ac](https://github.com/blackbaud/stache/commit/27ae4ac5f7ca8859beab13990afdcbe2c7379e7b))

## [8.0.0-alpha.5](https://github.com/blackbaud/stache/compare/8.0.0-alpha.4...8.0.0-alpha.5) (2023-02-06)


### ⚠ BREAKING CHANGES

* **stache:** set `StacheJsonDataService` as provided in 'root' ([#39](https://github.com/blackbaud/stache/issues/39))

### Features

* **stache:** set `StacheJsonDataService` as provided in 'root' ([#39](https://github.com/blackbaud/stache/issues/39)) ([03d905c](https://github.com/blackbaud/stache/commit/03d905c6c52413ceda70fa9e014ddc86f357fe01))

## [8.0.0-alpha.4](https://github.com/blackbaud/stache/compare/8.0.0-alpha.3...8.0.0-alpha.4) (2023-02-03)


### Bug Fixes

* **stache:** recursively look for child routes when locating root path ([#37](https://github.com/blackbaud/stache/issues/37)) ([b9c455e](https://github.com/blackbaud/stache/commit/b9c455e73dcfbae8b41b17001b95810dc14e89b6))

## [8.0.0-alpha.3](https://github.com/blackbaud/stache/compare/8.0.0-alpha.2...8.0.0-alpha.3) (2023-02-02)


### Bug Fixes

* **stache:** fix the StacheRouteService to handle child routes of a single root route ([#33](https://github.com/blackbaud/stache/issues/33)) ([7bbd9a6](https://github.com/blackbaud/stache/commit/7bbd9a646e2420360d18e0c289b9f15afff8d2f9))

## [8.0.0-alpha.2](https://github.com/blackbaud/stache/compare/8.0.0-alpha.1...8.0.0-alpha.2) (2023-02-01)


### Bug Fixes

* add support for `rxjs@6` ([#31](https://github.com/blackbaud/stache/issues/31)) ([733bfb3](https://github.com/blackbaud/stache/commit/733bfb33b7f74dc0caca97118ecab30ef06d903a))

## [8.0.0-alpha.1](https://github.com/blackbaud/stache/compare/8.0.0-alpha.0...8.0.0-alpha.1) (2023-01-31)


### Features

* update route metadata service to read from router module ([#25](https://github.com/blackbaud/stache/issues/25)) ([1f6d19b](https://github.com/blackbaud/stache/commit/1f6d19b2d69c85b24faec4a60ff76a2534c57fa8))

## 8.0.0-alpha.0 (2023-01-23)


### Features

* **clipboard:** add strict-mode support, remove 'clipboard-polyfill' ([#6](https://github.com/blackbaud/stache/issues/6)) ([65db2fc](https://github.com/blackbaud/stache/commit/65db2fc2377e3c1b585f1b0f90a429ab4a6ef437))
* **code-block:** add strict-mode support ([#7](https://github.com/blackbaud/stache/issues/7)) ([92d20c0](https://github.com/blackbaud/stache/commit/92d20c08245850b12945210983877d359489a208))

## [7.0.0](https://github.com/blackbaud/stache/compare/7.0.0...7.0.0) (2022-12-06)

### ⚠ BREAKING CHANGES

- Dropped support for Angular 13. [#133](https://github.com/blackbaud/skyux-lib-stache/pull/133)

### Features

- Added support for Angular 14. [#133](https://github.com/blackbaud/skyux-lib-stache/pull/133)
