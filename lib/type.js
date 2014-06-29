var Type

Type = function Type (name, definition) {

  if(!name) {
    throw new Error('Type must have a Name')
  }

  this.name = name

  if(typeof definition == 'function') {
    this.definition = definition
  }

  if(Array.isArray(definition)) {
    this.definition = this.compose(definition)
  }
}

Type.prototype.test = function test (string) {
  return this.definition(string)
}

Type.prototype.repeat = function repeat (delimiter, minTimes) {

  var self = this

  if(typeof delimiter != 'function') {
    throw new Error('Repetitions must have a delimiter matcher')
  }

  if(minTimes == null) {
    minTimes = 0
  }

  return function (str) {
    var cursor = 0
      , match
      , count = 0

    while(true) {
      match = self.definition(str.slice(cursor))

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
}

Type.prototype.compose = function compose (definitions) {

  if(!Array.isArray(definitions)) {
    throw new Error('Can only compose an array of definitions')
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
