
var /*sequelize_fixtures = require('sequelize-fixtures'),*/
    fs = require('fs'),
    parse = require('csv-parse'),
    Sequelize = require('sequelize'),
    db = require('./db').db,
    sequelize = db.sequelize,

    CONFIG = require('./config').config,
    models = require('./models').models;


function install_fixtures() {
    sequelize_fixtures.loadFile(CONFIG.project_path + 'fixtures/*.json', models)
    .then(function(){
        //doStuffAfterLoad();
    });
}

function install_csv(filepath) {
    console.log('reading csv file "' + filepath + '"');
    var parser = parse({delimiter: ','}),
        output = [];

    fs.readFile(filepath, function(err, data) {
        if (err) {
            console.log('oops ' + err);
            throw err;
        }
        parser.write(data);
    });

    input
        .on('open', function(fd) {
            console.log('stream open ' + fd);
            //parser.write(input.read());
            //console.log(output);
            input.pipe(parser);
        });


    // Use the writable stream api
    parser.on('readable', function(){
        while (true) {
            try {
                var record = parser.read();
            }
            catch (e) {
                console.dump('something (' + e + ') went wrong');
            }

            console.dump('next record: ' + record);
            if (record) {
                output.push(record);
            } else {
                break;
            }
        }
    });

    parser.on('error', function(err){
        console.log('parse error ' + err.message);
    });

    parser.on('finish', function(){
        console.log('done');
    });
}

function import_csv(filepath, model, list_of_fields) {
    console.log('clear table ' + model);
    var dump = require('jsDump');
    sequelize
        .sync({ force: true })
        .then(function() {
            console.log('reading csv file ' + filepath);
            fs.readFile(filepath, {
                encoding: 'utf-8'
            }, function(err, data) {
                if (err) throw err;

                var i, j, lines, line, values, value, field, bits,
                    creation_obj, loop_start = 0;
                lines = data.match(/^.*([\n\r]+|$)/gm);


                if (!list_of_fields) { // read fieldnames from first line
                    line = lines[0];
                    list_of_fields = line.split(',');
                    for (j = 0; j < list_of_fields.length; j++) {
                        list_of_fields[j] = list_of_fields[j].trim();
                    }
                    loop_start = 1;
                }

                for (i = loop_start; i < lines.length; i++) {
                    line = lines[i];
                    values = line.split(',');
                    creation_obj = {};

                    for (j=0; j < list_of_fields.length; j++) {

                        value = values[j].trim();
                        field = list_of_fields[j].trim();

                        if (value) {
                            // sort out date fields
                            if (model._isDateAttribute(field)) { // WARNING: uses sequelize internal method
                                console.log(field + ': ' + value);
                                bits = value.split('/');
                                value = new Date(bits[2], bits[1] - 1, bits[0]);
                                console.log(field + ': ' + value);
                            }
                            if (value.toLowerCase() == 'true') {
                                value = 1;
                            }
                            creation_obj[field] = value;
                        }
                    }
                    console.log(creation_obj);
                    model
                        .create(creation_obj)
                        .complete(function(err) {
                            if (!!err) {
                                console.log('Save failed: ', err)
                            } else {
                                console.log('Saved!')
                            }
                        });
                }
            });
    });
}

exports.utils = {
    install_fixtures: install_fixtures,
    install_csv: install_csv,
    import_csv: import_csv

};