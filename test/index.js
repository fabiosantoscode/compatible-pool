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
        }, 50)
        return p.acquire()
      })
      .then(function (res) {
        assert.equal(res, 1)
      })
  })
  it('pushes to this.unused', function () {
    let i = 0
    const destroyed = []
    const p = new Pool({
      create: () => ++i,
      destroy: res => destroyed.push(res),
      max: 1
    })
    p.acquire().then(p.release).then(function () {
      assert.deepEqual(p.unused, [1])
      return p.acquire()
    }).then(function (res) {
      assert.equal(res, 1, 'res is from this.unused')

      p.clear()

      assert.deepEqual(destroyed, [1])
    })
  })
})
