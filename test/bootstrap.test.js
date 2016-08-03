'use strict';

const bootstrap = require('./helpers/sharedBootstrap');

before(bootstrap.before);
beforeEach(bootstrap.beforeEach);

after(bootstrap.after);
