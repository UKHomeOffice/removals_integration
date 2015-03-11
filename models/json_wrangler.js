var models = require("../node/models.js").models,
    Q = require('q');
function json_wrangler(validate_against_db){
    this.json = '';
    this.data = null;
    this.validate_against_db = validate_against_db;
    this.errors = [];
    this.consume = function(json_data,callback){
        this.json = json_data;
        try{
            this.data = JSON.parse(this.json);
        } catch(err){
            throw("Input is not valid JSON");
        }
        if(this.validate_against_db){
            this.invalidate_centre_names(this.data,null)
                .then(function(centre){console.log("17 "+centre.name);})
                .then(null,function(err){console.log("18 "+err);});
/*
                    var deferred = Q.defer();
            Q.fcall(this.invalidate_centre_names,this.data,function(data,error){
                    if(data){
                        //console.log("18 "+data.name);
                        console.log("resolving "+data.name);
                        deferred.resolve(data);
                    }else{
                        //throw(error);
                        console.log("rejecting "+error);
                        deferred.reject(error);
                    }
                    console.log(deferred);
                    return deferred;
                })
                .then(function(x){console.log('OKK ')})
                .then(null,function(err){console.log("GOT ERROR " + err)});
            this.invalidate_centre_names(this.data,function(success, error){
                if(error){
                    throw(error);
                    //callback(null, error);
                } 
                if(success){
                    callback('OK', null);
                }
            });
*/
        }
        return this;
    };
    var self = this;
    this.invalidate_centre_names = function(data,callback){
        var centre_name = Object.keys(data.totals.bed_counts)[0];
        var deferred = Q.defer();
        self.find_centre_by_name(centre_name,null)
            .then(function(centre){deferred.resolve(centre);})
            .then(null,function(err){deferred.reject(err);});
        return deferred.promise;
    }
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
    }
    this.find_centre_by_name = function(name,callback){
            var deferred = Q.defer();
            models.Centre.findOne({where:{"name": name}})
                .then(function(centre){
                    //return callback(centre,null);
                    if(centre){
                        deferred.resolve(centre);
                    } else {
                        deferred.reject("no centre named "+name);
                    }
                })
            return deferred.promise;
                /*.error(function(err,data){
                    console.log("DB DERRROR"+err);
                    return callback(null,err);
                })*/;
    }
    this.update_centres = function(){
        for(centre_name in this.data.totals.bed_counts){
            var bed_counts = this.data.totals.bed_counts[centre_name];
            this.find_centre_by_name(centre_name,function(centre){
                var key_map = {
                    "male": "current_beds_male",
                    "female": "current_beds_female",
                    "out_of_commission": "current_beds_ooc",
                };
                for(key in key_map){
                    var field_name = key_map[key];
                    centre.set(field_name, bed_counts[key]);
                }
                centre.save();
            });
        }
        return true;
    }
};
module.exports = json_wrangler;
