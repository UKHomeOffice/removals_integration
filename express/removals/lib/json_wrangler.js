var models = require("./models.js").models,
    Q = require('q'),
    Qx = require('qx');

function json_wrangler(validate_against_db){
    this.json = '';
    this.data = null;
    this.validate_against_db = validate_against_db;
    this.errors = [];
    this.updated_centres = [];
    this.consume = function(json_data,callback){
        if(typeof(json_data) == 'object'){
            this.data = json_data;
        } else {
            this.json = json_data;
            try{
                this.data = JSON.parse(this.json);
            } catch(err){
                throw("Input is not valid JSON");
            }
        }
        var deferred = Q.defer();
        if(this.validate_against_db){
            this.invalidate_centre_names(this.data,null)
                .then(function(centre){deferred.resolve(centre);})
                .then(null,function(err){deferred.reject(err);});
        }
        return deferred.promise;
    };
    var self = this;
    this.invalidate_centre_names = function(data,callback){
        var centre_names = Object.keys(data.totals.bed_counts);
        var deferred = Q.defer();
        Qx.every(centre_names,self.find_centre_by_name)
            .then(function(centre){deferred.resolve(centre);})
            .then(null,function(err){deferred.reject(err);});
        return deferred.promise;
    };
    this.data_keys = function(){
        return Object.keys(this.data);
    };
    this.count_inbound = function(){
        return this.get_inbound().length;
    };
    this.count_outbound = function(){
        return this.get_outbound().length;
    };
    this.get_inbound = function(){
        return this.data.individuals.arrivals.map(function(item){
            return models.Person.build(item);
        });
    };
    this.get_outbound = function(){
        return this.data.individuals.departees.map(function(item){
            return models.Person.build(item);
        });
    };
    
    this.find_by_cid_id = function(cid_id, callback){
        models.Person.findOne({where:{"cid_id": cid_id}})
            .then(function(person){
                return callback(person);
        });
    };
    this.find_centre_by_name = function(name,callback){
            var deferred = Q.defer();
            models.Centre.findOne({where:{"name": name}})
                .then(function(centre){
                    //return callback(centre,null);
                    if(centre){
                        deferred.resolve(centre);
                    } else {
                        deferred.reject("No centre named "+name);
                    }
                })
            return deferred.promise;
    };
    this.update_centres = function(){
        var deferred = Q.defer();
        Qx.every(Object.keys(this.data.totals.bed_counts),this.update_centre_by_name)
            .then(function(){deferred.resolve()},null)
            .then(null,function(err){
                deferred.reject(err);
                console.log(err);
            });
        return deferred.promise;
    };
    this.update_centre_by_name = function(centre_name){
        var key_map = {
            "male": "current_beds_male",
            "female": "current_beds_female",
            "out_of_commission": "current_beds_ooc",
        };
        self.find_centre_by_name(centre_name,null)
            .then(function(centre){
                for(key in key_map){
                    var field_name = key_map[key];
                    centre.set(field_name, self.data.totals.bed_counts[centre_name][key]);
                }
                centre.save();
            });
    }
};
module.exports = json_wrangler;
