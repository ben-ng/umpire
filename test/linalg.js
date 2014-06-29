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
  , function matchReal (token) {
      var match = token.match(/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/)

      if(match) {
        return match[0]
      }
      // If no match is possible, return false
      else {
        return false
      }
    }
  , function isReal (a) {
      return typeof a == 'number' && !isNaN(a)
    }
  , function constructReal (str) {
      return parseFloat(str)
    })

  Vector = theory.defineType('Vector'
  , ['[', Real.repeat(','),']']
  , function isVector (vector) {
      if(!Array.isArray(vector)) {
        return false
      }

      for(var i=0, ii=vector.length; i<ii; ++i) {
        if(!Real.is(vector[i])) {
          return false
        }
      }

      return true
    }
  , function constructVector (str) {
      if(str.length == 2) {
        return []
      }

      str = str.slice(1, -1)

      var pieces = str.split(',')
        , i = 0
        , ii = pieces.length
        , vector = new Array(ii)

      for(; i<ii; ++i) {
        vector[i] = Real.construct(pieces[i], true)
      }

      return vector
    })

  Matrix = theory.defineType('Matrix'
  , ['[', Vector.repeat(','),']']
  , function isMatrix (matrix) {
      if(!Array.isArray(matrix)) {
        return false
      }

      for(var i=0, ii=matrix.length; i<ii; ++i) {
        if(!Vector.is(matrix[i])) {
          return false
        }
      }

      return true
    }
  , function constructMatrix (str) {

      var matrix = []
        , cursor = 1
        , openBrace = -1
        , end = str.length - 1

      for(; cursor < end; ++cursor) {
        switch(str.charAt(cursor)) {
          case '[':
            openBrace = cursor
          break
          case ']':
            matrix.push(Vector.construct(str.slice(openBrace, cursor + 1)))
          break
        }
      }

      return matrix
    })

  /*
  theory.defineOperation([
    theory.defineEquation([Matrix, '.', Vector], Vector)
  , theory.defineEquation([Matrix, '.', Matrix], Matrix)
  , theory.defineEquation([Vector, '.', Vector], Vector)
  ])
  */

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

  t.equal(Real.construct('0'), 0, '"0" is 0')
  t.equal(Real.construct('-1'), -1, '"-1" is -1')
  t.equal(Real.construct('-10.3e-9'), -10.3e-9, '"-10.3e-9" is -10.3e-9')
  t.deepEqual(Vector.construct('[]'), [], '"[]" is []')
  t.deepEqual(Matrix.construct('[[],[],[3]]'), [[],[],[3]], '"[[],[],[3]]" is [[],[],[3]]')
  t.deepEqual(Matrix.construct('[[1],[2],[3]]'), [[1],[2],[3]], '"[[1],[2],[3]]" is [[1],[2],[3]]')

  t.end()
})
