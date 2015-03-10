var fs = require('fs'),
    parse = require('csv-parse'),
    Sequelize = require('sequelize'),
    db = require('./db').db,
    sequelize = db.sequelize,

    CONFIG = require('./config').config,
    models = require('./models').models;

// http://www.bennadel.com/blog/1504-ask-ben-parsing-csv-strings-with-javascript-exec-regular-expression-command.htm
function CSVToArray(strData, delimiter) {
// Check to see if the delimiter is defined. If not,
// then default to comma.
    delimiter = (delimiter || ",");
// Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
// Delimiters.
            "(\\" + delimiter + "|\\r?\\n|\\r|^)" +
// Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
// Standard fields.
            "([^\"\\" + delimiter + "\\r\\n]*))"
            ),
        "gi"
    );
// Create an array to hold our data. Give the array
// a default empty first row.
    var arrData = [[]];
// Create an array to hold our individual pattern
// matching groups.
    var arrMatches;
// Keep looping over the regular expression matches
// until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)){
// Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];
// Check to see if the given delimiter has a length
// (is not the start of string) and if it matches
// field delimiter. If id does not, then we know
// that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != delimiter)
            ){
// Since we have reached a new row of data,
// add an empty row to our data array.
            arrData.push([]);
        }
// Now that we have our delimiter out of the way,
// let's check to see which kind of value we
// captured (quoted or unquoted).
        if (arrMatches[2]){
// We found a quoted value. When we capture
// this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
                new RegExp( "\"\"", "g" ),
                "\""
            );
        } else {
// We found a non-quoted value.
            var strMatchedValue = arrMatches[3];
        }
// Now that we have our value string, let's add
// it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }
// Return the parsed data.
    return(arrData);
}

/**
 * take a string in dd/mm/yy format  and return a js Date object
 * @param str string
 * @returns Date
 */
function parseDate(str) {
    if (!str) return null;
    var bits = str.split('/'),
        year = bits[2], nYear;
    if (year.length == 2) {
        nYear = parseInt(year);
        if (nYear >= 70) {
            year = '19' + year;
        } else {
            year = '20' + year;
        }
    }
    return new Date(year, bits[1] - 1, bits[0]);
}

function write_csv_to_db(model, list_of_fields, data) {
    var i, j, lines, values, value, field, creation_obj,
        loop_start = 0;
    lines = CSVToArray(data);

    if (!list_of_fields) { // read fieldnames from first line
        list_of_fields = lines[0];
        for (j = 0; j < list_of_fields.length; j++) {
            list_of_fields[j] = list_of_fields[j].trim();
        }
        loop_start = 1;
    }

    for (i = loop_start; i < lines.length; i++) {
        values = lines[i];
        creation_obj = {};

        for (j=0; j < list_of_fields.length; j++) {

            value = values[j].trim();
            field = list_of_fields[j].trim();

            if (value) {
                // sort out date fields
                console.log('current value: ' + value);
                if (model._isDateAttribute(field)) { // WARNING: uses sequelize internal method
                    value = parseDate(value);
                    console.log(field + ': ' + value);
                } else if (value.toLowerCase() == 'true ') {
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
}

/**
 * Take a CSV file and import its contents into the database
 * @param filepath string
 * @param model Model
 * @param wipe_db bool
 * @param list_of_fields Array if left blank field names are pulled from the first row
 */
function import_csv(filepath, model, wipe_db, list_of_fields) {
    console.log(wipe_db ? 'wiping db' : 'no db wipe');
    //var dump = require('jsDump');
    sequelize
        .sync({ force: wipe_db })
        .then(function() {
            console.log('reading csv file ' + filepath);
            fs.readFile(filepath, {
                encoding: 'utf-8'
            }, function(err, data) {
                if (err) throw err;

                write_csv_to_db(model, data, list_of_fields);
            });
    });
}

exports.utils = {
    import_csv: import_csv,
    parseDate : parseDate,
    write_csv_to_db: write_csv_to_db
};