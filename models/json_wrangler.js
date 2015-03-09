var models = require("../node/models.js").models;
function json_wrangler(validate_against_db){
    this.json = '';
    this.data = null;
    this.validate_against_db = validate_against_db;
    this.consume = function(json_data){
        try{
            this.json = json_data;
            this.data = JSON.parse(this.json);
            if(this.validate_against_db){
                try{
                    this.invalidate(this.data);
                } catch(err) {
                    throw(err);
                }
            }
        } catch(err) {
            console.log("caught in this.consume " + err);
            throw("Input is not valid JSON");
        }
        return this;
    };
    this.invalidate = function(data){
        try{
            this.invalidate_centre_names(data);
        } catch(err) {
            console.log("caught in this.invalidate " + err);
            throw(err);
        }
    }
    this.invalidate_centre_names = function(data){
        var errors = [];
        for(centre_name in data.totals.bed_counts){
            this.find_centre_by_name(centre_name,function(centre){
                if(!centre){
                    errors.push("No such Centre: " + centre_name);
                }
                if(errors.length){
                    throw(errors[0]);
                }
            });
        }
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
            models.Centre.findOne({where:{"name": name}})
                .then(function(centre){
                    try{
                        return callback(centre)
                    } catch(err) {
                    }
            }).catch(function(err){
                //console.log(err);
            });
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
