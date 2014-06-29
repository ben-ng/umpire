var Type

Type = function Type (name, match, is, construct) {

  if(!name) {
    throw new Error('Type must have a Name')
  }

  this.name = name

  if(typeof match == 'function') {
    this.match = match
  }
  else if(Array.isArray(match)) {
    this.match = this.concat(match)
  }
  else {
    throw new Error('Missing match')
  }

  if(typeof is == 'function') {
    this._is = is
  }
  else {
    throw new Error('Missing isType')
  }

  if(typeof construct == 'function') {
    this._construct = construct
  }
  else {
    throw new Error('Missing construct')
  }
}

Type.prototype.match = function match (string) {
  return this.match(string)
}

Type.prototype.is = function is (obj) {
  return this._is(obj)
}

Type.prototype.construct = function construct (string, _skipCheck) {
  if(_skipCheck != null && this.match(string) != string) {
    throw new Error('Cannot construct ' + this.name + ' from ' + string)
  }

  return this._construct(string)
}

Type.prototype.repeat = function repeat (delimiter, minTimes) {

  var self = this
    , repeated

  if(typeof delimiter == 'string') {
    delimiter = function (str) {
      return str.indexOf(',') === 0 ? ',' : false
    }
  }

  if(typeof delimiter != 'function') {
    throw new Error('Repetitions must have a delimiter matcher')
  }

  if(minTimes == null) {
    minTimes = 0
  }

  repeated = function (str) {
    var cursor = 0
      , match
      , count = 0

    while(true) {
      match = self.match(str.slice(cursor))

      if(match === false) {
        break
      }

      cursor += match.length

      // try to match the delimiter
      match = delimiter(str.slice(cursor))

      // no delimiter? this is the last one then
      if(match === false) {
        break
      }

      cursor += match.length

      count++
    }

    if(count >= minTimes) {
      return str.slice(0, cursor)
    }

    return false
  }

  repeated.name = this.name

  return repeated
}

Type.prototype.concat = function concat (definitions) {

  if(!Array.isArray(definitions)) {
    throw new Error('Can only concat an array of definitions')
  }

  var definitionFunctions = new Array(definitions.length)
    , makeMatcher

  makeMatcher = function (needle) {
    return function (str) {
      if(str.indexOf(needle) === 0) {
        return needle
      }

      return false
    }
  }

  for(var i=0, ii=definitions.length; i<ii; ++i) {
    if(typeof definitions[i] == 'function') {
      definitionFunctions[i] = definitions[i]
    }
    else {
      definitionFunctions[i] = makeMatcher(definitions[i])
    }
  }

  return function (str) {
    var i = 0
      , ii = definitionFunctions.length
      , cursor = 0
      , matched

    for(; i<ii; ++i) {
      matched = definitionFunctions[i](str.slice(cursor))

      if(matched !== false) {
        cursor += matched.length
      }
      // If any match fails, then the entire thing fails
      else {
        return false
      }
    }

    return str.slice(0, cursor)
  }
}

module.exports = Type
