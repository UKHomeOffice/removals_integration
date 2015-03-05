process.env.NODE_ENV = 'test';
var models = require("../node/models.js").models;

P = models.Person.findAll({where:{}});
console.log(P);
