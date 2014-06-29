var test = require('tape')
  , Umpire = require('../')

test('peano', function (t) {

  /**
  * Types
  */
  var theory = new Umpire()
    , Natural

  Natural = theory.defineType('Natural'
  , function stringIsNatural (str) {

    var cursor = 0
      , strlen = str.length

    while(true) {
      if(str.indexOf('s(', cursor) == cursor) {
        cursor += 2
      }
      else if(str.charAt(cursor) === '0') {
        // Ensure that all closing braces match
        for(var i = (cursor + 1), end = (cursor + 1 + cursor/2); i<end; ++i) {
          if(i >= strlen || str.charAt(i) != ')') {
            return false
          }
        }

        // Finished match
        return str.slice(0, end)
      }
      else {
        return false
      }
    }
  }, function isNatrual (arg) {
    return typeof arg === 'number' &&
            !isNaN(arg) &&
            Math.floor(arg) === arg
  }, function constructNatural (str) {
    var cursor = 0

    while(true) {
      if(str.indexOf('s(', cursor) == cursor) {
        cursor += 2
      }
      else {
        break
      }
    }

    return cursor/2
  })

  t.equal(theory.getType('0'), 'Natural', '0 is Natural')
  t.equal(theory.getType('s(0)'), 'Natural', 's(0) is Natural')
  t.equal(theory.getType('s(s(0)'), false, 's(s(0) is not Natural')
  t.equal(theory.getType('s(s(0))'), 'Natural', 's(s(0)) is Natural')
  t.equal(theory.getType('s(s(0)))'), false, 's(s(0))) is not Natural')

  t.equal(Natural.construct('0'), 0, '"0" is integer 0')
  t.equal(Natural.construct('s(0)'), 1, '"s(0)" is integer 1')
  t.equal(Natural.construct('s(s(0))'), 2, '"s(s(0))" is integer 2')

  t.end()
})
