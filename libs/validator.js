var Validator = require('jsonschema').Validator;

var addressSchema = require('../schemas/address.json');
var clientSchema = require('../schemas/client.json');

var _v = new Validator();

_v.addSchema(addressSchema, '/Address');

exports.client = function(json){
    return _v.validate(json, clientSchema);
}

exports.v = _v.validate;
