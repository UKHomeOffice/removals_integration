var models = require("./models.js").models;
function data_reader(){
    this.hello = function(){
        return 'hello ' + (new Date()).toString();
    };
    this.get_centres = function(callback){
        models.Centre
            .findAll({
                where : {
                    operator: 'mitie'
                }
            })
            .then(function(list){
                var outlist = {}, i;
                for(i = 0; i < list.length; i++){
                    var centre = list[i];
                    outlist[centre.name] = centre.dataValues;
                }
                callback(outlist);
            });
    }
}
module.exports = data_reader;
