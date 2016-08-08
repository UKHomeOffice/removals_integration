'use strict';

const validation_schema = {
  $schema: "http://json-schema.org/draft-04/schema#",
  type: "object",
  definitions: {
    Location: {
      type: "string"
    },
    InOut: {
      type: "string"
    },
    MORef: {
      type: "integer",
      minimum: 0
    },
    MODate: {
      type: "string"
    },
    MOType: {
      type: "string"
    },
    CIDPersonID: {
      type: "integer",
      minimum: 0
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
          "MO Type",
          "CID Person ID"
        ],
        properties: {
          Location: {$ref: "#/definitions/Location"},
          "MO In/MO Out": {$ref: "#/definitions/InOut"},
          "MO Ref": {$ref: "#/definitions/MORef"},
          "MO Date": {$ref: "#/definitions/MODate"},
          "MO Type": {$ref: "#/definitions/MOType"},
          "CID Person ID": {$ref: "#/definitions/CIDPersonID"}
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
