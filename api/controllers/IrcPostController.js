/**
 * IrcPostController
 *
 * @description :: Server-side logic for managing ircposts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * `IrcPostController.post()`
   */
  post: function (req, res) {
    var validate = require('jsonschema').validate;

    var validation_schema = require('./request_schemas/irc.json');

    var validation_response = validate(req.body, validation_schema);

    if (validation_response.errors.length > 0) {
      return res.badRequest(validation_response.errors);
    }
    return res.ok();
  }
};

