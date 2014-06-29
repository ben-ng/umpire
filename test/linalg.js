var test = require('tape')
  , Umpire = require('../')

test('linear algebra', function (t) {

  /**
  * Types
  */
  var theory = new Umpire()
    , Real
    , Vector
    , Matrix

  Real = theory.defineType('Real'
    // Definitions should return what they matched
  , function (token) {
    var match = token.match(/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/)

    if(match) {
      return match[0]
    }
    // If no match is possible, return false
    else {
      return false
    }
  })

  Vector = theory.defineType('Vector', ['[', Real.repeat(','),']'])

  Matrix = theory.defineType('Matrix', ['[', Vector.repeat(','),']'])

  t.equal(theory.getType('0'), 'Real', '0 is Real')
  t.equal(theory.getType('-1'), 'Real', '-1 is Real')
  t.equal(theory.getType('1'), 'Real', '1 is Real')
  t.equal(theory.getType('0.2'), 'Real', '0.2 is Real')
  t.equal(theory.getType('-0.2'), 'Real', '-0.2 is Real')
  t.equal(theory.getType('10.3e9'), 'Real', 'float is Real')
  t.equal(theory.getType('10.3e-9'), 'Real', 'float with -tive exp is Real')
  t.equal(theory.getType('-10.3e-9'), 'Real', '-tive float with -tive exp is Real')
  t.equal(theory.getType('-10.3ee'), false, '-10.3ee is not Real')
  t.equal(theory.getType('-'), false, '- is not Real')
  t.equal(theory.getType('--'), false, '-- is not Real')
  t.equal(theory.getType('-4-'), false, '-4- is not Real')

  t.equal(theory.getType('[]'), 'Vector', '[] is a Vector')
  t.equal(theory.getType('[0]'), 'Vector', '[0] is a Vector')
  t.equal(theory.getType('[0, 1]'), 'Vector', '[0, 1] is a Vector')
  t.equal(theory.getType('[-1.3e9]'), 'Vector', '[-1.3e9] is a Vector')

  t.equal(theory.getType('[[]]'), 'Matrix', '[[]] is a Matrix')
  t.equal(theory.getType('[[1,2],[3,4]]'), 'Matrix', '[[1,2],[3,4]] is a Matrix')
  t.equal(theory.getType('[[],[]]'), 'Matrix', '[[],[]] is a Matrix')
  t.equal(theory.getType('[[1],[2]]'), 'Matrix', '[[1],[2]] is a Matrix')
  t.equal(theory.getType('[[1],[2],[3]]'), 'Matrix', '[[1],[2],[3]] is a Matrix')
  t.equal(theory.getType('[[1, 2],[3, 4]]'), 'Matrix', '[[1, 2],[3, 4]] is a Matrix')
  t.equal(theory.getType('[[1, 2],[3, 4]]]'), false, '[[1, 2],[3, 4]]] is not a Matrix')
  t.equal(theory.getType('[[2],[]'), false, '[[2],[] is not a Matrix')

  t.end()
})
