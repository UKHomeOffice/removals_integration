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
                    centre.dataValues.slug = centre.name.replace(/([^\w])/g,'').toLowerCase();
                    centre.dataValues.is_full = centre.is_full();
                    outlist[centre.name] = centre.dataValues;
                }
                callback(outlist);
            });
    };
    this.get_centres_by_name_in = function(name_list,callback){
        console.log(name_list);
        models.Centre
            .findAll({
                where : {
                    name: name_list
                }
            })
            .then(function(list){
                var outlist = {}, i;
                for(i = 0; i < list.length; i++){
                    var centre = list[i];
                    centre.dataValues.slug = centre.name.replace(/([^\w])/g,'').toLowerCase();
                    centre.dataValues.is_full = centre.is_full();
                    outlist[centre.name] = centre.dataValues;
                }
                callback(outlist);
            });
    }
}
module.exports = data_reader;
