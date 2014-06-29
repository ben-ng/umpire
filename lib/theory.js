var Theory
  , Type = require('./type')

Theory = function () {
  this.types = {}
  this.operations = {}
}

Theory.prototype.normalize = function normalize (str) {
  return str.replace(/\s/g, '')
}

Theory.prototype.is = function is (typeName, str) {
  if(!this.types[typeName]) {
    throw new Error('Undefined type "' + typeName + '"')
  }

  var match = this.types[typeName].test(this.normalize(str))

  return match.length == str.length
}

Theory.prototype.getType = function getType (str) {
  str = this.normalize(str)

  var match

  for(var typeName in this.types) {
    match = this.types[typeName].test(str)

    if(match.length === str.length) {
      return typeName
    }
  }

  return false
}

Theory.prototype.repeat = function repeat (typeName, delimiter, minTimes) {
  if(!this.types[typeName]) {
    throw new Error('Undefined type "' + typeName + '"')
  }

  if(typeof delimiter == 'string') {
    delimiter = function (str) {
      return str.indexOf(',') === 0 ? ',' : false
    }
  }

  return this.types[typeName].repeat(delimiter, minTimes)
}

Theory.prototype.defineType = function defineType (typeName, definition) {
  if(this.types[typeName]) {
    throw new Error('This type already has been defined')
  }

  this.types[typeName] = new Type(typeName, definition)
}

/*
Umpire.prototype.operation = function addOperation (operationName) {
  if(this.operations[operationName]) {
    throw new Error('This operation has already been defined')
  }

  this.operations[operationName] = new Operation(Array.prototype.slice.call(arguments))
}
*/

module.exports = Theory
