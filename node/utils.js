var sequelize_fixtures = require('sequelize-fixtures'),
    fs = require('fs'),
    parse = require('csv-parse'),

    CONFIG = require('./config').config,
    models /*= require('./models').models*/;

function install_fixtures() {
    sequelize_fixtures.loadFile(CONFIG.project_path + 'fixtures/*.json', models)
    .then(function(){
        //doStuffAfterLoad();
    });
}

function install_csv(filepath) {
    console.log('reading csv file ' + filepath);
    var parser = parse({delimiter: ','}),
        input = fs.createReadStream(filepath),
        output = [];

    // Use the writable stream api
    parser.on('readable', function(){
        while (true) {
            try {
                var record = parser.read();
            }
            catch (e) {
                console.dump('something (' + e + ') went wrong');
            }
            if (record) {
                output.push(record);
                console.dump(record);
            } else {
                break;
            }
        }
    });

    parser.on('error', function(err){
        console.log(err.message);
    });

    parser.on('finish', function(){
        /*output.should.eql([
            [ 'root','x','0','0','root','/root','/bin/bash' ],
            [ 'someone','x','1022','1022','a funny cat','/home/someone','/bin/bash' ]
        ]);*/
        console.log('done');
        console.log(output);
    });

    // Now that setup is done, write data to the stream
    parser.write(input);

    parser.end();
}

exports.utils = {
    install_fixtures: install_fixtures,
    install_csv: install_csv
};