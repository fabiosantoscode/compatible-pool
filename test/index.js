'use strict'

const assert = require('assert').strict || require('assert')
const Pool = require('..')

describe('compatible-pool', function () {
  it('can acquire and release resources', function () {
    let i = 0
    const p = new Pool({
      create: () => ++i,
      destroy: () => null,
      max: 1
    })

    return p.acquire()
      .then(function (res) {
        assert.equal(res, 1)

        setTimeout(function () {
          assert.equal(i, 1)
          p.release(res)
        }, 100)
        return p.acquire()
      })
      .then(function (res) {
        assert.equal(res, 1)
      })
  })
})
