# Removals Integration API

[![Build](https://travis-ci.org/UKHomeOffice/removals_integration.png)](https://travis-ci.org/UKHomeOffice/removals_integration)
[![Coverage Status](https://coveralls.io/repos/github/UKHomeOffice/removals_integration/badge.svg)](https://coveralls.io/github/UKHomeOffice/removals_integration)
[![Quality](https://codeclimate.com/github/UKHomeOffice/removals_integration.png)](https://codeclimate.com/github/UKHomeOffice/removals_integration)
[![Dependencies](https://david-dm.org/UKHomeOffice/removals_integration.png)](https://david-dm.org/UKHomeOffice/removals_integration)
## Quickstart:

 Get [NodeJS](https://nodejs.org) via [nvm](https://github.com/creationix/nvm)
```sh
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
```

#### Install NodeJS 4 LTS
```sh
$ nvm install 4
$ nvm use 4
```
### Build:
```sh
$ npm install
```
### Test:
```sh
$ npm test
```
### CI Test:
```sh
$ npm test
```
### Start single-threaded unmanaged server:
```sh
$ npm start
```
### Start in production mode with MySQL server and Redis server:

(set environment variables to whatever you've configured)
```sh
NODE_ENV=productionAlter \
DBHOST=localhost \
DBPORT=3306 \
DBUSER=root \
DBPASS=root \
DBNAME=sails \
REDIS_SERVICE_HOST=localhost \
REDIS_SERVICE_PORT=6379 \
PORT=8080 \
npm start
```

## Environment variables

| VAR | OPTION | RESULT |
| --- | ------ | ------ |
| NODE_ENV | production | start in a production mode, use a mysql db, use redis, no fixtures, **do not run** migrations |
| NODE_ENV | productionAlter | start in a production mode, use a mysql db, use redis, no fixtures, **do run** migrations |
| NODE_ENV | development | start in a development mode, use a local in-memory database, no fixtures, no redis |
| PORT | [integer] | port to run node server on |
| DBHOST | [string] | mysql db host |
| DBPORT | [string] | mysql db port |
| DBUSER | [string] | mysql db user |
| DBPASS | [string] | mysql db password |
| REDIS_SERVICE_HOST | [string] | redis host |
| REDIS_SERVICE_PORT | [string] | redis port |

## Docker
Can be built and run in the same way with docker for example:
```sh
$ docker build -t ibm-backend .
$ docker run -i -e "NODE_ENV=development" ibm-backend
```
