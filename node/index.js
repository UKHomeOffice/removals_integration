var sass  = require('node-sass'),
    fs = require('fs');
    server = require("./server"),
    CONFIG = require("./config").config,

    cssOutputPath = CONFIG.project_path + '/public/css/main.css',
    sassBase = CONFIG.project_path + '/sass/base.scss';
    console.log('sassBase: ' + sassBase);

sass.render(
    {
        file: sassBase,
        //sourceMap: true,
        //outFile: cssOutputPath
    },
    function(err, result) {
        console.log(err ? 'sass error: ' + err : 'sass rendered! ');
        console.log(result);

        /*var output = fs.open(cssOutputPath, 'w', function() {
            output.write(result.css);
            output.close();
        });*/

        var stream = fs.createWriteStream(cssOutputPath, {
            flags: 'w',
            encoding: null,
            fd: null,
            mode: 0666
        });
        stream.write(result.css);
        stream.end();


    }
);


server.start();