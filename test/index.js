'use strict'

const assert = require('assert').strict || require('assert')
const os = require('os')
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
  it('defaults to os.cpus().length for the max argument', function () {
    const p = new Pool({ })
    assert.equal(p.max, os.cpus().length)
    return p.acquire().then(function (res) {
      assert.equal(res, null)
      assert.equal(p.destroy(res), null)
    })
  })
  it('propagates errors from create and destroy functions', function () {
    let doThrow = false
    const p = new Pool({
      create: () => { if (doThrow) throw new Error() },
      destroy: () => { throw new Error() }
    })

    return p.acquire()
      .then(function () {
        doThrow = true
        return p.acquire()
      })
      .then(function () {
        assert(false)
      }, function (e) {
        return p.clear()
      })
      .then(function () {
        assert(false)
      }, function() {
        return null
      })
  })
})
