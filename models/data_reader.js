var models = require("../node/models.js").models;
function data_reader(){
    this.hello = function(){
        return 'hello ' + (new Date()).toString();
    }
    this.get_centres = function(callback){
        models.Centre.findAll({}).then(function(list){
            var outlist = {};
            for(i in list){
                var centre = list[i];
                outlist[centre.name] = centre;
            }
            callback(outlist);
        });
    }
}
module.exports = data_reader;
