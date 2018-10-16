# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2018-10-16
### Changed
- chokidar updated to support developing this package with Node 10
### Added
- new version check
- code style enforced with eslint
- support for environmental variables and .env files

## [1.1.1] - 2018-03-01
### Changed
- way of forcing file change catch, it should be a little bit faster now
### Added
- Changelog file
### Fixed
- Support for spaces and single quotes in filenames (double quotes aren't valid on Windows anyway)

## [1.1.0] - 2018-02-19
### Added
- support for long volumes syntax from docker-compose v3.2 (fixes #1)
- error when docker-compose version is different than `3`
### Fixed
- treating non-bind volumes as relative path when short syntax is used, not they're skipped

## [1.0.2] - 2018-02-18
### Fixed
- debug/verbose output not being shown
- non-terminated docker processes leaks

## [1.0.1] - 2018-02-18
### Fixed
- dot `.` directory watching

## [1.0.0] - 2018-02-17
### Added
- basic functionality
