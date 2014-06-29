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

  var match = this.types[typeName].match(this.normalize(str))

  return match.length == str.length
}

Theory.prototype.getType = function getType (str) {
  str = this.normalize(str)

  var match

  for(var typeName in this.types) {
    match = this.types[typeName].match(str)

    if(match.length === str.length) {
      return typeName
    }
  }

  return false
}

/**
* Define a new type
*
* typeName - string
* definition - string/matching function, or an array of them to concat
*/
Theory.prototype.defineType = function defineType (typeName, stringIsType, isType, construct) {
  if(this.types[typeName]) {
    throw new Error('This type already has been defined')
  }

  this.types[typeName] = new Type(typeName, stringIsType, isType, construct)

  return this.types[typeName]
}

/**
* Define an operation
*
* operationName = string
*
*/

/*
Umpire.prototype.operation = function addOperation (operationName) {
  if(this.operations[operationName]) {
    throw new Error('This operation has already been defined')
  }

  this.operations[operationName] = new Operation(Array.prototype.slice.call(arguments))
}
*/

module.exports = Theory
