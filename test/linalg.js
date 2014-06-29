var test = require('tape')
  , Umpire = require('../')

test('linear algebra', function (t) {

  /**
  * Types
  */
  var theory = new Umpire()

  theory.defineType('Real'
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

  theory.defineType('Vector', ['[', theory.repeat('Real', ','),']'])

  theory.defineType('Matrix', ['[', theory.repeat('Vector', ','),']'])

  t.equal(theory.getType('0'), 'Real')
  t.equal(theory.getType('-1'), 'Real')
  t.equal(theory.getType('1'), 'Real')
  t.equal(theory.getType('0.2'), 'Real')
  t.equal(theory.getType('-0.2'), 'Real')
  t.equal(theory.getType('10.3e9'), 'Real')
  t.equal(theory.getType('10.3e-9'), 'Real')
  t.equal(theory.getType('-10.3e-9'), 'Real')
  t.equal(theory.getType('-10.3ee'), false)
  t.equal(theory.getType('-'), false)
  t.equal(theory.getType('--'), false)
  t.equal(theory.getType('-4-'), false)

  t.equal(theory.getType('[]'), 'Vector')
  t.equal(theory.getType('[0]'), 'Vector')
  t.equal(theory.getType('[0, 1]'), 'Vector')
  t.equal(theory.getType('[-1.3e9]'), 'Vector')

  t.equal(theory.getType('[[]]'), 'Matrix')
  t.equal(theory.getType('[[1,2],[3,4]]'), 'Matrix')
  t.equal(theory.getType('[[],[]]'), 'Matrix')
  t.equal(theory.getType('[[1],[2]]'), 'Matrix')
  t.equal(theory.getType('[[1],[2],[3]]'), 'Matrix')
  t.equal(theory.getType('[[1, 2],[3, 4]]'), 'Matrix')
  t.equal(theory.getType('[[1, 2],[3, 4]]]'), false)

  t.end()
})
