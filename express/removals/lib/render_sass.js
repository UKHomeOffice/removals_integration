var fs = require('fs');
var sass  = require('node-sass');

function renderSass(sassBase, cssOutputFile) {
    sassBase = './sass/' + sassBase;
    cssOutputFile = './public/stylesheets/' + cssOutputFile;
    console.log('rendering sass from ' + sassBase + ' to ' + cssOutputFile);
    sass.render({ file: sassBase },
        function (err, result) {
            console.log(err ? 'sass error: ' + err : 'sass rendered! ');
            console.log(result);
            var stream = fs.createWriteStream(cssOutputFile, {
                flags: 'w',
                encoding: null,
                fd: null,
                mode: 0666
            });
            stream.on('finish', function () {
                console.log('CSS has been output to ' + cssOutputFile);
            });
            stream.write(result.css);
            stream.end();
        });
}

exports.renderSass = renderSass;