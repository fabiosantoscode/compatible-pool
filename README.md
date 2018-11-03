# compatible-pool

[![Build Status](https://travis-ci.org/fabiosantoscode/compatible-pool.svg?branch=master)](https://travis-ci.org/fabiosantoscode/compatible-pool) [![Coverage Status](https://coveralls.io/repos/github/fabiosantoscode/compatible-pool/badge.svg?branch=master)](https://coveralls.io/github/fabiosantoscode/compatible-pool?branch=master)

Runs a map function on a set of values. The function will run on as many processors your machine has, or on `max` processes.

## new Pool({ max: number, create: async () => res, destroy: res => (destroys res) })

 - max: maximum number of parallel processes
 - create: return your resource here as a promise
 - destroy: destroy your resource

## pool.acquire() -> Promise<res>

Aquire a resource from the pool. This can take longer if the maximum number of processes has been reached.

## pool.release(res)

Release a resource in the pool.

## pool.clear()

Clear everything in the pool.
