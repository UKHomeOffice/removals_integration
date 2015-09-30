# bedspacemanagement

## Quickstart:

 Get [NodeJS](https://nodejs.org) via [nvm](https://github.com/creationix/nvm)
```
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.27.1/install.sh | bash
````
* Install NodeJS 4.1.1
```
$ nvm install 4.1.1
$ nvm use 4.1.1
```
* Install [PM2](https://github.com/Unitech/pm2)
```
$ npm install -g pm2
```
### Build:
```
$ npm install
````
### Test:
```
$ npm test
```
### CI Test:
```
$ npm run-script coverage-test
$ npm run-script coverage-report
```
### Start single-threaded unmanaged server:
```
$ npm start
```
### Start multi-threaded managed server:
```
$ pm2 start process.json
```
* Watch logs: ```$ pm2 logs```
* See status: ```$ pm2 status```
* Generate a system startup script ```$ pm2 startup```
* Reload all threads: ```$ pm2 reload```
* Further docs on PM2 see [here](https://github.com/Unitech/pm2)
