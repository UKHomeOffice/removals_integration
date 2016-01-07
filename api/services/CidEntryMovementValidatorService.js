"use strict";
const validation_schema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  type: "object",
  definitions: {
    Location: {
      type: "string"
    },
    InOut: {
      type: "string"
    },
    MORef: {
      type: "string"
    },
    MODate: {
      type: "string"
    },
    CIDPersonID: {
      oneOf: [
        {
          "type": "integer"
        }, {
          "type": "null"
        }]
    },
    CurrentRFO: {
      type: "string"
    }
  },
  properties: {
    additionalProperties: false,
    cDataSet: {
      type: "array",
      additionalItems: true,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "Location",
          "MO In/MO Out",
          "MO Ref",
          "MO Date",
          "CID Person ID",
          "Current RFO"
        ],
        properties: {
          "Location": {"$ref": "#/definitions/Location"},
          "MO In/MO Out": {"$ref": "#/definitions/InOut"},
          "MO Ref": {"$ref": "#/definitions/MORef"},
          "MO Date": {"$ref": "#/definitions/MODate"},
          "CID Person ID": {"$ref": "#/definitions/CIDPersonID"},
          "Current RFO": {"$ref": "#/definitions/CurrentRFO"}
        }
      }
    }
  },
  required: [
    "cDataSet"
  ]
};

module.exports = {
  validate: function (request_body) {
    return RequestValidatorService.validate(request_body, validation_schema);
  },
  schema: validation_schema
};
