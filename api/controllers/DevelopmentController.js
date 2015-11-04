var _ = require('lodash');
var child_process = require('child_process');
var os = require('os');

module.exports = {
  index: (req, res) => {
    var git = child_process.spawn('git', ['log', '-n', '10', '--no-pager'])
    //console.log(req);
    var response = {};
    response.headers = req.headers;
    response.url = req.url;
    response.type = req.method;
    response.env = process.env;
    response.cpus = os.cpus();
    response.loadavg = os.loadavg();
    response.networkInterfaces = os.networkInterfaces();
    response.freemem = os.freemem();
    var format = '{%n  "commit": "%H",%n  "abbreviated_commit": "%h",%n  "tree": "%T",%n  "abbreviated_tree": "%t",%n  "parent": "%P",%n  "abbreviated_parent": "%p",%n  "refs": "%D",%n  "encoding": "%e",%n  "subject": "%s",%n  "sanitized_subject_line": "%f",%n  "body": "%b",%n  "commit_notes": "%N",%n  "verification_flag": "%G?",%n  "signer": "%GS",%n  "signer_key": "%GK",%n  "author": {%n    "name": "%aN",%n    "email": "%aE",%n    "date": "%aD"%n  },%n  "commiter": {%n    "name": "%cN",%n    "email": "%cE",%n    "date": "%cD"%n  }%n},';
    User.find({}).then(users => {
      response.users = users;
      child_process.exec('git log -n 20  --pretty=format:\'' + format + '\'', function (error, stdout, stderr) {
        response.git = JSON.parse('[' + stdout.slice(0, -1) + ']');
        res.ok(response);
      });
    });
  }
}
