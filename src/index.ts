'use strict'

const os = require('os')

type CreateFn = () => Promise<any>
type DestroyFn = (res: any) => void

class Pool {
  max: number
  create: CreateFn
  destroy: DestroyFn
  resources: Array<any> = []
  unused: Array<any> = []
  waitingList: Array<(res: any) => void> = []

  constructor({
    max = os.cpus().length,
    create = () => Promise.resolve(null),
    destroy = () => null
  }) {
    this.max = max
    this.create = create
    this.destroy = destroy
  }

  acquire = async (): Promise<any> => {
    if (this.unused.length) {
      return this.unused.pop()
    }
    if (this.resources.length >= this.max) {
      return new Promise<any>((resolve: (res: any) => void) => {
        this.waitingList.push(resolve)
      })
    }
    const res = await this.create()
    this.resources.push(res)
    return res
  }

  release = (res: any) => {
    if (this.waitingList.length) {
      this.waitingList.pop()!(res)
      return
    }
    this.unused.push(res)
  }

  clear = () => {
    this.resources.forEach(res => { this.destroy(res) })
  }
}

module.exports = Pool
