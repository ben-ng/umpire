# Umpire

[![Build Status](https://travis-ci.org/ben-ng/umpire.svg?branch=master)](https://travis-ci.org/ben-ng/umpire)

[![browser support](https://ci.testling.com/ben_ng/umpire.png)
](https://ci.testling.com/ben_ng/umpire)

A logical framework.

## Usage
```javascript
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

  // Match on [Real, Real, ...]
  theory.defineType('Vector', ['[', theory.repeat('Real', ','),']'])

  // Match on [Vector, Vector, ...]
  theory.defineType('Matrix', ['[', theory.repeat('Vector', ','),']'])

  /// Assert on types
  t.equal(theory.getType('0'), 'Real')
  t.equal(theory.getType('-10.3e-9'), 'Real')
  t.equal(theory.getType('-10.3ee'), false)
  t.equal(theory.getType('[-1.3e9, 3]'), 'Vector')
  t.equal(theory.getType('[[1, 2],[3, 4]]'), 'Matrix')
```
